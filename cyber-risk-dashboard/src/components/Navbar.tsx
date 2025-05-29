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
  Menu,
  MenuItem,
  Fade,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import React from 'react';

interface NavbarProps {
  onToggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const toolItems = [
  { name: 'Topic Modeling', path: '/topic-modeling' },
  { name: 'Risk Identification', path: '/risk-identification' },
  { name: 'Risk Quantification', path: '/risk-quantification' },
];

const navItems = [
  { name: 'Home', path: '/' },
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
  const [toolsAnchorEl, setToolsAnchorEl] = useState<null | HTMLElement>(null);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const menuTimeoutRef = React.useRef<NodeJS.Timeout>();

  const clearMenuTimeout = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = undefined;
    }
  };

  const handleToolsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchorEl(event.currentTarget);
    setIsToolsMenuOpen(true);
  };

  const handleToolsMenuClose = () => {
    setIsToolsMenuOpen(false);
    setToolsAnchorEl(null);
  };

  const handleButtonMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setToolsAnchorEl(event.currentTarget);
    setIsToolsMenuOpen(true);
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => clearMenuTimeout();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem key="home" disablePadding>
        <ListItemButton
          component={RouterLink}
          to="/"
          onClick={handleDrawerToggle}
        >
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
      <ListItem key="tools" disablePadding>
        <ListItemButton onClick={handleToolsMenuOpen}>
          <ListItemText primary="Our Tools" />
        </ListItemButton>
      </ListItem>
      {toolItems.map((item) => (
        <ListItem key={item.name} disablePadding sx={{ pl: 4 }}>
          <ListItemButton
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      ))}
      {navItems.slice(1).map((item) => (
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
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ 
                  fontSize: '0.75rem', 
                  minWidth: 0, 
                  px: 0.5,
                  textTransform: 'none',
                }}
              >
                Home
              </Button>
              <Box
                onMouseLeave={handleToolsMenuClose}
                sx={{ 
                  display: 'inline-flex',
                  position: 'relative',
                }}
              >
                <Button
                  color="inherit"
                  onMouseEnter={handleButtonMouseEnter}
                  aria-haspopup="true"
                  aria-expanded={isToolsMenuOpen}
                  aria-controls={isToolsMenuOpen ? 'tools-menu' : undefined}
                  endIcon={
                    <ExpandMoreIcon 
                      sx={{ 
                        transform: isToolsMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease-in-out',
                      }} 
                    />
                  }
                  sx={{ 
                    fontSize: '0.75rem', 
                    minWidth: 0, 
                    px: 1.5,
                    py: 0.75,
                    textTransform: 'none',
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: isToolsMenuOpen ? 
                      (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                      'transparent',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 
                        'rgba(255, 255, 255, 0.12)' : 
                        'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  Our Tools
                </Button>
                <Menu
                  id="tools-menu"
                  anchorEl={toolsAnchorEl}
                  open={isToolsMenuOpen}
                  onClose={handleToolsMenuClose}
                  disableAutoFocus
                  disableEnforceFocus
                  disablePortal
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 150 }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  MenuListProps={{
                    'aria-label': 'Tools navigation',
                    onMouseLeave: handleToolsMenuClose,
                    style: { 
                      display: 'flex', 
                      flexDirection: 'row',
                      padding: '6px',
                      gap: '4px',
                    }
                  }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                      mt: 0.5,
                      minWidth: 400,
                      backgroundColor: theme.palette.mode === 'dark' ? 
                        'rgba(0, 0, 0, 0.85)' : 
                        'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 2,
                      border: `1px solid ${
                        theme.palette.mode === 'dark' ? 
                          'rgba(255, 255, 255, 0.12)' : 
                          'rgba(0, 0, 0, 0.12)'
                      }`,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 20,
                        width: 10,
                        height: 10,
                        bgcolor: 'inherit',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        borderLeft: `1px solid ${
                          theme.palette.mode === 'dark' ? 
                            'rgba(255, 255, 255, 0.12)' : 
                            'rgba(0, 0, 0, 0.12)'
                        }`,
                        borderTop: `1px solid ${
                          theme.palette.mode === 'dark' ? 
                            'rgba(255, 255, 255, 0.12)' : 
                            'rgba(0, 0, 0, 0.12)'
                        }`,
                      },
                    },
                  }}
                >
                  {toolItems.map((item, index) => (
                    <MenuItem
                      key={item.name}
                      component={RouterLink}
                      to={item.path}
                      onClick={handleToolsMenuClose}
                      sx={{ 
                        fontSize: '0.75rem',
                        px: 2,
                        py: 1,
                        borderRadius: 1.5,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minWidth: 120,
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 
                            'rgba(255, 255, 255, 0.12)' : 
                            'rgba(0, 0, 0, 0.08)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: 0,
                          height: 2,
                          backgroundColor: theme.palette.primary.main,
                          transition: 'all 0.2s ease-in-out',
                        },
                        '&:hover:after': {
                          width: '80%',
                          left: '10%',
                        },
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              {navItems.slice(1).map((item) => (
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

          {/* Right section with login/signup and logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
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
    </>
  );
};

export default Navbar; 