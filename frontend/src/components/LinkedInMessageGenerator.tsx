import React, { useState, useRef } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Alert,
  Collapse
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { LinkedInProfile } from '../types/linkedin.ts';
import { generatePersonalizedMessage } from '../api/api.ts';

const sampleData: LinkedInProfile = {
  name: "John Doe",
  job_title: "Software Engineer",
  company: "TechCorp",
  location: "San Francisco, CA",
  summary: "Experienced in AI & ML with over 5 years of experience building scalable applications."
};

const LinkedInMessageGenerator: React.FC = () => {
  const [profile, setProfile] = useState<LinkedInProfile>({
    name: '',
    job_title: '',
    company: '',
    location: '',
    summary: ''
  });
  
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  
  const messageRef = useRef<HTMLDivElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['name', 'job_title', 'company'];
    const missingFields = requiredFields.filter(field => !profile[field as keyof LinkedInProfile]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.map(field => field.replace('_', ' ')).join(', ')}`);
      setOpenAlert(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    setOpenAlert(false);
    
    try {
      const generatedMessage = await generatePersonalizedMessage(profile);
      setMessage(generatedMessage);
    } catch (err: any) {
      console.error('Error generating message:', err);
      // Handle specific API errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to generate message. Please try again.');
      }
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFillSampleData = () => {
    setProfile(sampleData);
  };
  
  const handleCopyMessage = () => {
    if (message) {
      navigator.clipboard.writeText(message).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        },
        () => {
          setError('Failed to copy message');
          setOpenAlert(true);
        }
      );
    }
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          LinkedIn Message Generator
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Enter LinkedIn profile details to generate a personalized outreach message.
        </Typography>
        
        <Collapse in={openAlert}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setOpenAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        </Collapse>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                error={openAlert && !profile.name}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="job_title"
                value={profile.job_title}
                onChange={handleChange}
                required
                error={openAlert && !profile.job_title}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={profile.company}
                onChange={handleChange}
                required
                error={openAlert && !profile.company}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Summary"
                name="summary"
                value={profile.summary}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleFillSampleData}
                >
                  Use Sample Data
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Generating...' : 'Generate Message'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {message && (
          <Card variant="outlined" sx={{ mt: 4 }} ref={messageRef}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Generated Message</Typography>
                <Box>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Regenerate
                  </Button>
                  <Button
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyMessage}
                    variant="outlined"
                    size="small"
                    color={copied ? "success" : "primary"}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default LinkedInMessageGenerator;
