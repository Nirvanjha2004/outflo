import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { scrapeLinkedInProfiles } from '../api/api.ts';

const EXAMPLE_SEARCH_URL = 'https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&sid=z%40k&titleFreeText=Founder';

interface LinkedInLeadSearchProps {
  onSearchComplete: () => void;
}

const LinkedInLeadSearch: React.FC<LinkedInLeadSearchProps> = ({ onSearchComplete }) => {
  const [searchUrl, setSearchUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText(EXAMPLE_SEARCH_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchUrl.trim()) {
      setError('Please enter a LinkedIn search URL');
      return;
    }
    
    if (!searchUrl.includes('linkedin.com/search/results/')) {
      setError('Please enter a valid LinkedIn search URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await scrapeLinkedInProfiles(searchUrl);
      
      if (response.success) {
        setSuccess(response.message);
        setSearchUrl('');
        onSearchComplete();
      } else {
        setError(response.message || 'An error occurred while scraping');
      }
    } catch (err: any) {
      console.error('LinkedIn scraping error:', err);
      setError(err.response?.data?.message || 'Failed to scrape LinkedIn profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom fontWeight="medium">
        Search LinkedIn Leads
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter a LinkedIn search URL to scrape profiles matching your criteria. The results will be stored in your leads database.
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>{success}</Alert>}
      
      <Box component="form" onSubmit={handleSearch}>
        <TextField
          fullWidth
          label="LinkedIn Search URL"
          variant="outlined"
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
          placeholder="https://www.linkedin.com/search/results/people/..."
          required
          disabled={loading}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Example search URL format:
          </Typography>
          <Tooltip title="Copy example URL">
            <IconButton 
              size="small" 
              onClick={handleCopyExample}
              color={copied ? "success" : "primary"}
              sx={{ ml: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {copied && (
            <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
              Copied!
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip title="Make sure you are logged into LinkedIn in your browser before scraping">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon color="action" fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Limited to 20 profiles per search to avoid detection
              </Typography>
            </Box>
          </Tooltip>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Scraping...' : 'Start Scraping'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default LinkedInLeadSearch;
