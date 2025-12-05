import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Hotels
      </Typography>
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={hotel.images?.[0] || 'https://via.placeholder.com/400x200'}
                alt={hotel.name}
              />
              <CardContent>
                <Typography variant="h6">{hotel.name}</Typography>
                <Typography color="text.secondary">{hotel.location}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  {hotel.description?.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${hotel.pricePerNight}/night
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate(`/hotels/${hotel._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HotelList;
