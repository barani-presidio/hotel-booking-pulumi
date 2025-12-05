import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from '../api/axios';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/bookings', {
        hotel: id,
        user: '000000000000000000000000', // Replace with actual user ID from auth
        ...formData,
        totalPrice: 0, // Calculate based on dates
      });
      alert('Booking successful!');
      navigate('/');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Book Your Stay</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Check-in Date"
          type="date"
          value={formData.checkInDate}
          onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Check-out Date"
          type="date"
          value={formData.checkOutDate}
          onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Number of Guests"
          type="number"
          value={formData.numberOfGuests}
          onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" variant="contained" fullWidth size="large">
          Confirm Booking
        </Button>
      </Box>
    </Container>
  );
};

export default BookingForm;
