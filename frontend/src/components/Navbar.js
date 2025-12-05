import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import HotelIcon from '@mui/icons-material/Hotel';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <HotelIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hotel Booking
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Hotels
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
