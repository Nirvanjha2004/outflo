import { chromium, Browser, Page } from 'playwright-chromium';
import dotenv from 'dotenv';
import LinkedInProfile, { ILinkedInProfile } from '../models/linkedin-profile.model';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface ScrapedProfile {
  fullName: string;
  jobTitle: string;
  company: string;
  location: string;
  profileUrl: string;
  profileImageUrl?: string;
  connectionDegree?: string;
  aboutSummary?: string;
}

export class LinkedInScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn = false;
  private readonly EMAIL = process.env.LINKEDIN_EMAIL || '';
  private readonly PASSWORD = process.env.LINKEDIN_PASSWORD || '';
  private readonly BASE_DELAY = 2000; // Base delay between actions in ms
  private readonly SCRAPE_LIMIT = 20; // Maximum number of profiles to scrape
  
  private getRandomDelay(): number {
    // Random delay between BASE_DELAY and BASE_DELAY*2 ms
    return this.BASE_DELAY + Math.floor(Math.random() * this.BASE_DELAY);
  }
  
  private async initialize(): Promise<void> {
    if (this.browser) return;
    
    console.log('Initializing LinkedIn scraper...');
    
    try {
      // Launch browser with stealth mode
      this.browser = await chromium.launch({
        headless: false, // Set to true for production, false for debugging
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
        ],
      });
      
      const context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
      });
      
      this.page = await context.newPage();
      
      // Enable JS console
      this.page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
      
      // Check if cookies exist and load them to skip login
      const cookiesPath = path.join(__dirname, 'linkedin_cookies.json');
      
      if (fs.existsSync(cookiesPath)) {
        console.log('Loading cookies from file...');
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
        await context.addCookies(cookies);
        this.isLoggedIn = true;
      } else {
        await this.login();
      }
      
    } catch (error) {
      console.error('Error initializing LinkedIn scraper:', error);
      throw error;
    }
  }
  
  private async login(): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');
    
    if (!this.EMAIL || !this.PASSWORD) {
      throw new Error('LinkedIn credentials not provided in environment variables');
    }
    
    try {
      console.log('Logging in to LinkedIn...');
      
      // Navigate to LinkedIn login page
      await this.page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(this.getRandomDelay());
      
      // Fill login form
      await this.page.fill('#username', this.EMAIL);
      await this.page.waitForTimeout(500);
      await this.page.fill('#password', this.PASSWORD);
      await this.page.waitForTimeout(1000);
      
      // Click sign in button
      await this.page.click('[type="submit"]');
      
      // Wait for navigation to complete
      await this.page.waitForNavigation({ waitUntil: 'networkidle' });
      
      // Check if login was successful
      const currentUrl = this.page.url();
      if (currentUrl.includes('linkedin.com/feed') || currentUrl.includes('linkedin.com/checkpoint') || currentUrl.includes('linkedin.com/home')) {
        console.log('Successfully logged in to LinkedIn');
        this.isLoggedIn = true;
        
        // Save cookies for future use
        const context = this.page.context();
        const cookies = await context.cookies();
        const cookiesPath = path.join(__dirname, 'linkedin_cookies.json');
        fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
        console.log('Saved cookies to file');
      } else {
        console.error('Failed to login to LinkedIn. Current URL:', currentUrl);
        throw new Error('LinkedIn login failed');
      }
      
    } catch (error) {
      console.error('Error during LinkedIn login:', error);
      throw error;
    }
  }
  
  private async extractProfileData(profileCard: any): Promise<ScrapedProfile | null> {
    try {
      // Extract profile URL from the card
      const profileUrl = await profileCard.$eval('a[data-control-name="search_srp_result"]', (a: any) => a.href);
      
      // Check if profile already exists in database
      const existingProfile = await LinkedInProfile.findOne({ profileUrl });
      if (existingProfile) {
        console.log(`Profile already exists: ${profileUrl}`);
        return null;
      }
      
      // Extract profile details
      const fullName = await profileCard.evaluate((node: any) => {
        const nameElement = node.querySelector('.entity-result__title-text a');
        return nameElement ? nameElement.innerText.trim().split('\n')[0] : '';
      });
      
      const jobTitle = await profileCard.evaluate((node: any) => {
        const titleElement = node.querySelector('.entity-result__primary-subtitle');
        return titleElement ? titleElement.innerText.trim() : '';
      });
      
      const company = await profileCard.evaluate((node: any) => {
        const companyElement = node.querySelector('.entity-result__secondary-subtitle');
        return companyElement ? companyElement.innerText.trim() : '';
      });
      
      const location = await profileCard.evaluate((node: any) => {
        const locationElement = node.querySelector('.entity-result__tertiary-subtitle');
        return locationElement ? locationElement.innerText.trim() : '';
      });
      
      const profileImageUrl = await profileCard.evaluate((node: any) => {
        const imgElement = node.querySelector('.presence-entity__image');
        return imgElement ? imgElement.src : '';
      });
      
      const connectionDegree = await profileCard.evaluate((node: any) => {
        const degreeElement = node.querySelector('.dist-value');
        return degreeElement ? degreeElement.innerText.trim() : '';
      });
      
      return {
        fullName,
        jobTitle,
        company,
        location,
        profileUrl,
        profileImageUrl,
        connectionDegree
      };
      
    } catch (error) {
      console.error('Error extracting profile data:', error);
      return null;
    }
  }
  
  public async scrapeSearchResults(searchUrl: string): Promise<ILinkedInProfile[]> {
    try {
      await this.initialize();
      
      if (!this.page || !this.isLoggedIn) {
        throw new Error('LinkedIn scraper not properly initialized');
      }
      
      console.log(`Navigating to search URL: ${searchUrl}`);
      await this.page.goto(searchUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(this.getRandomDelay());
      
      const scrapedProfiles: ILinkedInProfile[] = [];
      let pageCount = 1;
      let profileCount = 0;
      
      while (profileCount < this.SCRAPE_LIMIT) {
        console.log(`Scraping page ${pageCount}...`);
        
        // Wait for the search results to load
        await this.page.waitForSelector('.reusable-search__entity-result-list', { timeout: 10000 });
        await this.page.waitForTimeout(this.getRandomDelay());
        
        // Get all profile cards on the current page
        const profileCards = await this.page.$$('.reusable-search__result-container');
        
        console.log(`Found ${profileCards.length} profile cards on this page`);
        
        for (const profileCard of profileCards) {
          if (profileCount >= this.SCRAPE_LIMIT) break;
          
          const profileData = await this.extractProfileData(profileCard);
          
          if (profileData) {
            try {
              // Store in MongoDB
              const profile = new LinkedInProfile({
                ...profileData,
                searchQuery: searchUrl
              });
              
              await profile.save();
              scrapedProfiles.push(profile);
              profileCount++;
              
              console.log(`Saved profile: ${profileData.fullName} (${profileCount}/${this.SCRAPE_LIMIT})`);
            } catch (error) {
              console.error('Error saving profile to database:', error);
            }
          }
          
          // Random delay between processing profiles
          await this.page.waitForTimeout(500 + Math.random() * 1000);
        }
        
        // Check if we've reached the scrape limit
        if (profileCount >= this.SCRAPE_LIMIT) break;
        
        // Check if there's a "Next" button and click it
        const nextButton = await this.page.$('button[aria-label="Next"]');
        if (!nextButton || await nextButton.evaluate((btn: any) => btn.disabled)) {
          console.log('No more pages available');
          break;
        }
        
        console.log('Navigating to next page...');
        await nextButton.click();
        await this.page.waitForNavigation({ waitUntil: 'networkidle' });
        await this.page.waitForTimeout(this.getRandomDelay());
        
        pageCount++;
      }
      
      return scrapedProfiles;
      
    } catch (error) {
      console.error('Error scraping LinkedIn search results:', error);
      throw error;
    } finally {
      if (this.browser) {
        console.log('Closing browser...');
        await this.browser.close();
        this.browser = null;
        this.page = null;
        this.isLoggedIn = false;
      }
    }
  }
  
  public async getStoredProfiles(query: string = '', limit: number = 100): Promise<ILinkedInProfile[]> {
    try {
      let queryObj = {};
      
      if (query) {
        queryObj = { $text: { $search: query } };
      }
      
      return await LinkedInProfile.find(queryObj)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
        
    } catch (error) {
      console.error('Error fetching profiles from database:', error);
      throw error;
    }
  }
}

export default new LinkedInScraper();
