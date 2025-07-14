import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfilePictureUpload from './ProfilePictureUpload';

interface NavbarProps {
  onToggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Risk Quantification', path: '/risk-quantification' },
  { name: 'Reports', path: '/reports' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

// Styled component for logos that handles dark mode
const StyledLogo = styled('img')(({ theme }) => ({
  height: 40,
  filter: theme.palette.mode === 'dark' 
    ? 'invert(1) grayscale(1) brightness(1.2) contrast(1.2)' 
    : 'none',
  transition: 'filter 0.3s ease-in-out',
}));

const Navbar = ({ onToggleColorMode, mode }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profilePictureDialogOpen, setProfilePictureDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  const handleProfilePictureClick = () => {
    setProfilePictureDialogOpen(true);
    handleUserMenuClose();
  };

  const handleAccountSettingsClick = () => {
    navigate('/account-settings');
    handleUserMenuClose();
  };

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItem key={item.name} disablePadding>
          <ListItemButton
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
      <Divider sx={{ my: 1 }} />
      <ListItem>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={onToggleColorMode}
              color="primary"
            />
          }
          label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />
      </ListItem>
      <Divider sx={{ my: 1 }} />
      {isAuthenticated ? (
        <>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <ProfilePictureUpload size={32} showEditButton={false} />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
                {user?.role === 'manager' && user?.organization?.code && (
                  <Typography variant="caption" color="primary">
                    Org Code: {user.organization.code}
                  </Typography>
                )}
              </Box>
            </Box>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => {
                handleAccountSettingsClick();
                handleDrawerToggle();
              }}
              sx={{ 
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              Account Settings
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
              sx={{ 
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              Logout
            </Button>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/login"
              onClick={handleDrawerToggle}
              sx={{ 
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              Login
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              component={RouterLink}
              to="/signup"
              onClick={handleDrawerToggle}
              sx={{ 
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
            >
              Sign Up
            </Button>
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ width: '100%', left: 0, right: 0, margin: 0, borderRadius: 0, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 56 }}>
            <StyledLogo src="/logo2.png" alt="NYU Logo" style={{ marginRight: 12 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' },
                maxWidth: { xs: 100, sm: 180, md: 260 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              }}
            >
              MyConstructionCyberRisk
            </Typography>
          </Box>

          {/* Navigation and dark mode toggle (center/right) */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{ 
                    fontSize: '0.75rem', 
                    minWidth: 0, 
                    px: 0.5,
                    textTransform: 'none',
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton
                  onClick={onToggleColorMode}
                  color="inherit"
                  sx={{
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(180deg)',
                    },
                  }}
                >
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Right section with login/signup or user menu and logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Account">
                      <Box onClick={handleUserMenuClick} sx={{ cursor: 'pointer' }}>
                        <ProfilePictureUpload size={32} showEditButton={false} />
                      </Box>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleUserMenuClose}
                      onClick={handleUserMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          minWidth: 200,
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem disabled>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user?.email}
                          </Typography>
                          {user?.role === 'manager' && user?.organization?.code && (
                            <Typography variant="caption" color="primary">
                              Org Code: {user.organization.code}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleProfilePictureClick}>
                        <PhotoCameraIcon sx={{ mr: 1 }} />
                        Profile Picture
                      </MenuItem>
                      <MenuItem onClick={handleAccountSettingsClick}>
                        <SettingsIcon sx={{ mr: 1 }} />
                        Account Settings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      color="inherit"
                      variant="outlined"
                      size="small"
                      sx={{ 
                        fontSize: '0.75rem',
                        minWidth: 0,
                        px: 1,
                        borderColor: 'inherit',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                        },
                        textTransform: 'none',
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="contained"
                      size="small"
                      sx={{ 
                        fontSize: '0.75rem',
                        minWidth: 0,
                        px: 1,
                        textTransform: 'none',
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 56 }}>
              <StyledLogo src="/logo3.png" alt="SMART Group Logo" style={{ marginLeft: 12 }} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawer}
      </Drawer>

      {/* Standalone Profile Picture Upload Dialog */}
      {profilePictureDialogOpen && (
        <ProfilePictureUpload 
          size={120} 
          showEditButton={false}
          showAvatar={false}
          externalOpen={profilePictureDialogOpen}
          onExternalClose={() => setProfilePictureDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
