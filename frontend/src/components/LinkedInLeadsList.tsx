import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  Link,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CampaignIcon from '@mui/icons-material/Campaign';
import { LinkedInProfile } from '../types/linkedin-profile.ts';
import { getLinkedInProfiles, deleteLinkedInProfileById } from '../api/api.ts';

interface LinkedInLeadsListProps {
  refreshTrigger: number;
}

const LinkedInLeadsList: React.FC<LinkedInLeadsListProps> = ({ refreshTrigger }) => {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, profileId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProfileId(profileId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProfileId(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLinkedInProfileById(id);
      setProfiles(profiles.filter(profile => profile._id !== id));
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete profile. Please try again.');
    }
  };

  // Load profiles from the API
  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await getLinkedInProfiles(searchQuery);
      setProfiles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading LinkedIn profiles:', err);
      setError('Failed to load LinkedIn profiles. Please try again.');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Search profiles when search query changes (with debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      loadProfiles();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reload profiles when refreshTrigger changes
  useEffect(() => {
    loadProfiles();
  }, [refreshTrigger]);

  return (
    <Paper elevation={0} sx={{ borderRadius: 3 }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="medium">
            LinkedIn Leads
          </Typography>
          
          <TextField
            placeholder="Search leads..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : profiles.length === 0 ? (
        <Box textAlign="center" my={8} px={3}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No leads found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Use the search tool above to scrape LinkedIn profiles
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profiles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((profile) => (
                    <TableRow key={profile._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={profile.profileImageUrl} 
                            alt={profile.fullName}
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            {profile.fullName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                              {profile.fullName}
                            </Typography>
                            <Link 
                              href={profile.profileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              color="primary" 
                              variant="caption"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              View Profile
                              <OpenInNewIcon sx={{ fontSize: 12, ml: 0.5 }} />
                            </Link>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{profile.jobTitle}</TableCell>
                      <TableCell>{profile.company}</TableCell>
                      <TableCell>{profile.location}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, profile._id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={profiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add to Campaign</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <MessageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Generate Message</ListItemText>
            </MenuItem>
            <Tooltip title="Delete Lead">
              <MenuItem onClick={() => selectedProfileId && handleDelete(selectedProfileId)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
              </MenuItem>
            </Tooltip>
          </Menu>
        </>
      )}
    </Paper>
  );
};

export default LinkedInLeadsList;
