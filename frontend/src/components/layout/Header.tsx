import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import SettingsIcon from '@mui/icons-material/Settings';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import { styled } from '@mui/material/styles';

const Logo = styled('img')({
  height: 36,
});

const pages = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Campaigns', path: '/dashboard', icon: <CampaignIcon /> },
  { name: 'Leads', path: '/leads', icon: <GroupIcon /> }, // Add this line
  { name: 'Messages', path: '/dashboard?tab=1', icon: <MessageIcon /> },
];

const settings = ['Profile', 'Account', 'Logout'];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const isLandingPage = location.pathname === '/';

  return (
    <AppBar 
      position="static" 
      color={isLandingPage ? "transparent" : "primary"}
      sx={{ 
        boxShadow: isLandingPage ? 'none' : undefined,
        backgroundColor: isLandingPage ? 'transparent' : undefined
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: isLandingPage ? theme.palette.primary.main : 'white',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <Box component="span" sx={{ 
              bgcolor: isLandingPage ? 'white' : theme.palette.primary.dark,
              color: isLandingPage ? theme.palette.primary.main : 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              mr: 1,
              fontWeight: 800
            }}>OUT</Box>
            FLO
          </Typography>

          {isMobile && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color={isLandingPage ? "primary" : "inherit"}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: theme.palette.primary.main,
                      }}
                    >
                      <Box component="span" sx={{ 
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mr: 1,
                        fontWeight: 800
                      }}>OUT</Box>
                      FLO
                    </Typography>
                  </Box>
                  <Divider />
                  <List>
                    {pages.map((page) => (
                      <ListItem 
                        button 
                        key={page.name}
                        component={Link}
                        to={page.path}
                        selected={location.pathname === page.path}
                      >
                        <ListItemIcon>{page.icon}</ListItemIcon>
                        <ListItemText primary={page.name} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <List>
                    <ListItem button>
                      <ListItemIcon><SettingsIcon /></ListItemIcon>
                      <ListItemText primary="Settings" />
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </Box>
          )}

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: isLandingPage ? theme.palette.primary.main : 'white',
              textDecoration: 'none',
              alignItems: 'center',
            }}
          >
            <Box component="span" sx={{ 
              bgcolor: isLandingPage ? 'white' : theme.palette.primary.dark,
              color: isLandingPage ? theme.palette.primary.main : 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              mr: 1,
              fontWeight: 800
            }}>OUT</Box>
            FLO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{
                  my: 2,
                  color: isLandingPage ? 'text.primary' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  mr: 2,
                  '&:hover': {
                    backgroundColor: isLandingPage ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                startIcon={page.icon}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {!isLandingPage && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" sx={{ bgcolor: theme.palette.secondary.main }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {isLandingPage && (
            <Box sx={{ flexGrow: 0 }}>
              <Button 
                component={Link} 
                to="/dashboard"
                variant="contained"
                sx={{ ml: 2 }}
              >
                Go to Dashboard
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
