import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Chip } from '@mui/material';
import axios from '../api/axios';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const response = await axios.get(`/hotels/${id}`);
      setHotel(response.data);
    } catch (error) {
      console.error('Error fetching hotel:', error);
    }
  };

  if (!hotel) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>{hotel.name}</Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {hotel.location}
      </Typography>
      <Typography variant="body1" paragraph>{hotel.description}</Typography>
      
      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Amenities:</Typography>
        {hotel.amenities?.map((amenity, index) => (
          <Chip key={index} label={amenity} sx={{ mr: 1, mt: 1 }} />
        ))}
      </Box>

      <Typography variant="h4" color="primary" sx={{ my: 2 }}>
        ${hotel.pricePerNight} per night
      </Typography>

      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate(`/book/${hotel._id}`)}
      >
        Book Now
      </Button>
    </Container>
  );
};

export default HotelDetail;
