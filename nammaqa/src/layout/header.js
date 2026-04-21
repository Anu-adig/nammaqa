import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, Routes, Route } from "react-router-dom";

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

import PublicIcon from '@mui/icons-material/Public';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
// import TestPage from "../pages/TestPage";

import logo from '../images/nammaqa.png';

// pages
import { Aptitude } from "../pages/Aptitude.js";
import Reasoning from "../pages/Reasoning.js";
import { CodingTheory } from "../pages/CoingT.js";
import { CodingPractical } from "../pages/CodingPractical.js";
import TestPage from "../pages/TestPage";
import AssignmentGuidelinesCard from '../pages/AssignmentGuidelinesModal.js';

const drawerWidth = 280;

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // ✅ MENU (clean)
  const menuItems = [
    {
      text: "General Aptitude",
      icon: <PublicIcon />,
      path: "/aptitude"
    },
    {
      text: "Logical Reasoning",
      icon: <LightbulbIcon />,
      path: "/reasoning"
    },
    {
      text: "Coding Theoretical",
      icon: <DvrOutlinedIcon />,
      path: "/coding-theory"
    },
    {
      text: "Coding Practical",
      icon: <DvrOutlinedIcon />,
      path: "/coding-practical"
    }
  ];

  const drawer = (
    <div>
      <Toolbar />

      <Box sx={{ textAlign: "center", p: 2 }}>
        <img src={logo} style={{ width: '200px' }} alt="logo" />
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerClose}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: '#E9B734' },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* SIDEBAR */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />

        <Routes>
          <Route path="/aptitude" element={<Aptitude />} />
          <Route path="/reasoning" element={<Reasoning />} />
          <Route path="/coding-theory" element={<CodingTheory />} />
          <Route path="/coding-practical" element={<CodingPractical />} />
          <Route path = "/test" element={<AssignmentGuidelinesCard/>} />
          <Route path="/test/:module" element={<TestPage />} />
        </Routes>

      </Box>
    </Box>
  );
}

Header.propTypes = {
  window: PropTypes.func,
};

export default Header;