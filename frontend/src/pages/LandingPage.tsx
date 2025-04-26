import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Paper,
  Avatar,
  useTheme,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';

const LandingPage = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <AutoGraphIcon fontSize="large" color="primary" />,
      title: 'Campaign Management',
      description: 'Create, manage and track outreach campaigns all in one place.'
    },
    {
      icon: <MessageIcon fontSize="large" color="primary" />,
      title: 'AI Message Generation',
      description: 'Generate personalized messages for each prospect using advanced AI.'
    },
    {
      icon: <GroupIcon fontSize="large" color="primary" />,
      title: 'Lead Management',
      description: 'Import, organize and track leads throughout your sales pipeline.'
    },
    {
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      title: 'Time Saving',
      description: 'Save 5+ hours per week with automated outreach sequences.'
    },
  ];

  const pricing = [
    {
      title: 'Free',
      price: '$0',
      description: 'Basic features for small teams',
      features: [
        '3 campaigns',
        '100 leads per month',
        'AI message generation',
        'Basic analytics'
      ],
      buttonText: 'Sign up free',
      buttonVariant: 'outlined',
    },
    {
      title: 'Pro',
      price: '$49',
      description: 'Everything you need for growing teams',
      features: [
        'Unlimited campaigns',
        '1,000 leads per month',
        'Advanced analytics',
        'Campaign automation',
        'Priority support'
      ],
      buttonText: 'Start Pro trial',
      buttonVariant: 'contained',
      highlighted: true,
    },
    {
      title: 'Enterprise',
      price: '$199',
      description: 'Advanced features for power users',
      features: [
        'Unlimited campaigns',
        'Unlimited leads',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced security controls',
        'SLA guarantee'
      ],
      buttonText: 'Contact sales',
      buttonVariant: 'outlined',
    },
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      position: 'Sales Director at TechCorp',
      quote: 'Outflo has completely transformed our sales outreach. We\'ve seen a 40% increase in response rates and saved countless hours.',
    },
    {
      name: 'Samantha Lee',
      position: 'Growth Lead at StartupX',
      quote: 'The AI message generator is a game-changer. Our messages feel personalized and we\'ve doubled our meeting bookings.',
    },
    {
      name: 'Michael Rodriguez',
      position: 'SDR Team Lead at EnterpriseY',
      quote: 'Managing all our LinkedIn campaigns in one place has streamlined our entire process. I can\'t imagine going back to our old ways.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: { xs: 8, sm: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                color="text.primary"
                gutterBottom
                fontWeight="bold"
                sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                LinkedIn Outreach, 
                <Box component="span" sx={{ color: 'primary.main', position: 'relative' }}>
                  {' Automated'}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: 0,
                      width: '100%',
                      height: '8px',
                      background: theme.palette.primary.main,
                      opacity: 0.2,
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Generate personalized messages, manage campaigns, and increase your LinkedIn response rates with AI-powered outreach.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 5 }}
              >
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  color="primary"
                  startIcon={<RocketLaunchIcon />}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                >
                  Watch Demo
                </Button>
              </Stack>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: 2,
                  bgcolor: 'rgba(67, 97, 238, 0.05)',
                  borderRadius: 2
                }}
              >
                <VerifiedIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>3,500+</strong> sales professionals use Outflo to power their outreach
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://placehold.co/600x400/4361ee/FFFFFF/png?text=Outflo+Dashboard&font=Montserrat"
                alt="Outflo Dashboard"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: '0 20px 40px rgba(67, 97, 238, 0.15)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            color="text.primary"
            gutterBottom
            align="center"
            sx={{ mb: 6 }}
          >
            Outreach Features That Drive Results
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ mb: 6 }}
          >
            What Our Users Say
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item key={index} xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{
                        mb: 3,
                        fontStyle: 'italic',
                        position: 'relative',
                        '&:before': {
                          content: '"""',
                          fontSize: '3rem',
                          position: 'absolute',
                          left: -15,
                          top: -20,
                          opacity: 0.2,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      {testimonial.quote}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" component="div">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.position}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Simple, Transparent Pricing
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            component="p"
            sx={{ mb: 6 }}
          >
            Choose the plan that's right for you
          </Typography>

          <Grid container spacing={4} alignItems="stretch">
            {pricing.map((tier, index) => (
              <Grid
                item
                key={tier.title}
                xs={12}
                sm={6}
                md={4}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: tier.highlighted ? `2px solid ${theme.palette.primary.main}` : undefined,
                    borderRadius: 3,
                    transform: tier.highlighted ? 'scale(1.05)' : undefined,
                    boxShadow: tier.highlighted ? '0 8px 30px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {tier.highlighted && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 15,
                        right: -30,
                        transform: 'rotate(45deg)',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        py: 0.5,
                        px: 3,
                        width: 140,
                      }}
                    >
                      <Typography
                        align="center"
                        variant="body2"
                        sx={{ fontWeight: 'bold' }}
                      >
                        MOST POPULAR
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ pt: 4, px: 4, pb: 0, flexGrow: 1 }}>
                    <Typography
                      component="h3"
                      variant="h5"
                      align="center"
                      color={tier.highlighted ? 'primary.main' : 'text.primary'}
                      gutterBottom
                      sx={{ fontWeight: 'bold' }}
                    >
                      {tier.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'baseline',
                        mb: 2,
                      }}
                    >
                      <Typography component="h4" variant="h3" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {tier.price}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        /mo
                      </Typography>
                    </Box>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{ mb: 3 }}
                    >
                      {tier.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {tier.features.map((feature) => (
                        <Box
                          key={feature}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 1,
                          }}
                        >
                          <VerifiedIcon sx={{ color: 'success.main', mr: 2, fontSize: '1.2rem' }} />
                          <Typography variant="body1">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3 }}>
                    <Button
                      component={RouterLink}
                      to="/dashboard"
                      fullWidth
                      variant={tier.buttonVariant as any}
                      color={tier.highlighted ? 'primary' : 'primary'}
                      size="large"
                    >
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h3" component="h2" gutterBottom align="center">
                Ready to supercharge your LinkedIn outreach?
              </Typography>
              <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
                Start your 14-day free trial today. No credit card required.
              </Typography>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Get Started Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
