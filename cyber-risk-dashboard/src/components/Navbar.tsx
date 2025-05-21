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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled } from '@mui/material/styles';

interface NavbarProps {
  onToggleColorMode: () => void;
  mode: 'light' | 'dark';
}

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Topic Modeling', path: '/topic-modeling' },
  { name: 'Risk Identification', path: '/risk-identification' },
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
                  sx={{ fontSize: '0.85rem', minWidth: 0, px: 0.75 }}
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

          {/* Right logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 56 }}>
            <StyledLogo src="/logo3.png" alt="SMART Group Logo" style={{ marginLeft: 12 }} />
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