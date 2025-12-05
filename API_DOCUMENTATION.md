# Backend API Documentation

Complete API reference for the Hotel Booking System backend.

**Base URL**: `http://localhost:5002/api` (local) or your deployed backend URL

---

## Authentication Endpoints

### 1. Register User

**Endpoint**: `POST /api/auth/register`

**Description**: Register a new user account

**Request Headers**:
```
Content-Type: application/json
```

**Request Payload**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "User already exists"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

---

### 2. Login User

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticate user and receive JWT token

**Request Headers**:
```
Content-Type: application/json
```

**Request Payload**:
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Invalid credentials"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

---

## Hotel Endpoints

### 3. Get All Hotels

**Endpoint**: `GET /api/hotels`

**Description**: Retrieve all hotels

**Request Headers**: None required

**Request Payload**: None

**Response (200 OK)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Grand Hotel",
    "description": "Luxurious hotel in the heart of the city",
    "location": "New York, NY",
    "pricePerNight": 199.99,
    "amenities": ["WiFi", "Pool", "Gym", "Spa"],
    "images": [
      "https://example.com/hotel1.jpg",
      "https://example.com/hotel2.jpg"
    ],
    "rating": 4.5,
    "availableRooms": 10,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Beach Resort",
    "description": "Beautiful beachfront resort",
    "location": "Miami, FL",
    "pricePerNight": 299.99,
    "amenities": ["WiFi", "Beach Access", "Restaurant"],
    "images": ["https://example.com/resort1.jpg"],
    "rating": 4.8,
    "availableRooms": 5,
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
]
```

**cURL Example**:
```bash
curl http://localhost:5002/api/hotels
```

---

### 4. Get Hotel by ID

**Endpoint**: `GET /api/hotels/:id`

**Description**: Retrieve a specific hotel by ID

**Request Headers**: None required

**URL Parameters**:
- `id` (string, required): Hotel MongoDB ObjectId

**Request Payload**: None

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Grand Hotel",
  "description": "Luxurious hotel in the heart of the city",
  "location": "New York, NY",
  "pricePerNight": 199.99,
  "amenities": ["WiFi", "Pool", "Gym", "Spa"],
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "rating": 4.5,
  "availableRooms": 10,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Hotel not found"
}
```

**cURL Example**:
```bash
curl http://localhost:5002/api/hotels/507f1f77bcf86cd799439011
```

---

### 5. Create Hotel

**Endpoint**: `POST /api/hotels`

**Description**: Create a new hotel (typically admin only)

**Request Headers**:
```
Content-Type: application/json
```

**Request Payload**:
```json
{
  "name": "Grand Hotel",
  "description": "Luxurious hotel in the heart of the city",
  "location": "New York, NY",
  "pricePerNight": 199.99,
  "amenities": ["WiFi", "Pool", "Gym", "Spa"],
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "rating": 4.5,
  "availableRooms": 10
}
```

**Field Descriptions**:
- `name` (string, required): Hotel name
- `description` (string, required): Hotel description
- `location` (string, required): Hotel location
- `pricePerNight` (number, required): Price per night in USD
- `amenities` (array of strings, optional): List of amenities
- `images` (array of strings, optional): List of image URLs
- `rating` (number, optional): Rating from 0-5 (default: 0)
- `availableRooms` (number, optional): Number of available rooms (default: 0)

**Response (201 Created)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Grand Hotel",
  "description": "Luxurious hotel in the heart of the city",
  "location": "New York, NY",
  "pricePerNight": 199.99,
  "amenities": ["WiFi", "Pool", "Gym", "Spa"],
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "rating": 4.5,
  "availableRooms": 10,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5002/api/hotels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grand Hotel",
    "description": "Luxurious hotel in the heart of the city",
    "location": "New York, NY",
    "pricePerNight": 199.99,
    "amenities": ["WiFi", "Pool", "Gym", "Spa"],
    "images": ["https://example.com/hotel1.jpg"],
    "rating": 4.5,
    "availableRooms": 10
  }'
```

---

### 6. Update Hotel

**Endpoint**: `PUT /api/hotels/:id`

**Description**: Update an existing hotel

**Request Headers**:
```
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): Hotel MongoDB ObjectId

**Request Payload** (all fields optional, only include fields to update):
```json
{
  "name": "Updated Hotel Name",
  "pricePerNight": 249.99,
  "availableRooms": 15,
  "rating": 4.7
}
```

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Hotel Name",
  "description": "Luxurious hotel in the heart of the city",
  "location": "New York, NY",
  "pricePerNight": 249.99,
  "amenities": ["WiFi", "Pool", "Gym", "Spa"],
  "images": [
    "https://example.com/hotel1.jpg",
    "https://example.com/hotel2.jpg"
  ],
  "rating": 4.7,
  "availableRooms": 15,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-20T14:45:00.000Z"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Hotel not found"
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:5002/api/hotels/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "pricePerNight": 249.99,
    "availableRooms": 15
  }'
```

---

### 7. Delete Hotel

**Endpoint**: `DELETE /api/hotels/:id`

**Description**: Delete a hotel

**Request Headers**: None required

**URL Parameters**:
- `id` (string, required): Hotel MongoDB ObjectId

**Request Payload**: None

**Response (200 OK)**:
```json
{
  "message": "Hotel deleted"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Hotel not found"
}
```

**cURL Example**:
```bash
curl -X DELETE http://localhost:5002/api/hotels/507f1f77bcf86cd799439011
```

---

## Booking Endpoints

### 8. Get All Bookings

**Endpoint**: `GET /api/bookings`

**Description**: Retrieve all bookings with populated hotel and user data

**Request Headers**: None required

**Request Payload**: None

**Response (200 OK)**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "hotel": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Grand Hotel",
      "location": "New York, NY",
      "pricePerNight": 199.99
    },
    "user": {
      "_id": "507f1f77bcf86cd799439031",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "checkInDate": "2024-02-01T00:00:00.000Z",
    "checkOutDate": "2024-02-05T00:00:00.000Z",
    "numberOfGuests": 2,
    "totalPrice": 799.96,
    "status": "confirmed",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
]
```

**cURL Example**:
```bash
curl http://localhost:5002/api/bookings
```

---

### 9. Get Booking by ID

**Endpoint**: `GET /api/bookings/:id`

**Description**: Retrieve a specific booking by ID with populated hotel and user data

**Request Headers**: None required

**URL Parameters**:
- `id` (string, required): Booking MongoDB ObjectId

**Request Payload**: None

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "hotel": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Grand Hotel",
    "description": "Luxurious hotel in the heart of the city",
    "location": "New York, NY",
    "pricePerNight": 199.99,
    "amenities": ["WiFi", "Pool", "Gym", "Spa"],
    "rating": 4.5
  },
  "user": {
    "_id": "507f1f77bcf86cd799439031",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "checkInDate": "2024-02-01T00:00:00.000Z",
  "checkOutDate": "2024-02-05T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 799.96,
  "status": "confirmed",
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Booking not found"
}
```

**cURL Example**:
```bash
curl http://localhost:5002/api/bookings/507f1f77bcf86cd799439021
```

---

### 10. Create Booking

**Endpoint**: `POST /api/bookings`

**Description**: Create a new booking

**Request Headers**:
```
Content-Type: application/json
```

**Request Payload**:
```json
{
  "hotel": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439031",
  "checkInDate": "2024-02-01T00:00:00.000Z",
  "checkOutDate": "2024-02-05T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 799.96,
  "status": "pending"
}
```

**Field Descriptions**:
- `hotel` (string, required): Hotel MongoDB ObjectId
- `user` (string, required): User MongoDB ObjectId
- `checkInDate` (date, required): Check-in date (ISO 8601 format)
- `checkOutDate` (date, required): Check-out date (ISO 8601 format)
- `numberOfGuests` (number, required): Number of guests (minimum: 1)
- `totalPrice` (number, required): Total booking price
- `status` (string, optional): Booking status - "pending", "confirmed", or "cancelled" (default: "pending")

**Response (201 Created)**:
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "hotel": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439031",
  "checkInDate": "2024-02-01T00:00:00.000Z",
  "checkOutDate": "2024-02-05T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 799.96,
  "status": "pending",
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:5002/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "hotel": "507f1f77bcf86cd799439011",
    "user": "507f1f77bcf86cd799439031",
    "checkInDate": "2024-02-01T00:00:00.000Z",
    "checkOutDate": "2024-02-05T00:00:00.000Z",
    "numberOfGuests": 2,
    "totalPrice": 799.96,
    "status": "pending"
  }'
```

---

### 11. Update Booking Status

**Endpoint**: `PATCH /api/bookings/:id/status`

**Description**: Update the status of a booking

**Request Headers**:
```
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): Booking MongoDB ObjectId

**Request Payload**:
```json
{
  "status": "confirmed"
}
```

**Status Values**:
- `"pending"`: Booking is pending confirmation
- `"confirmed"`: Booking is confirmed
- `"cancelled"`: Booking is cancelled

**Response (200 OK)**:
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "hotel": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439031",
  "checkInDate": "2024-02-01T00:00:00.000Z",
  "checkOutDate": "2024-02-05T00:00:00.000Z",
  "numberOfGuests": 2,
  "totalPrice": 799.96,
  "status": "confirmed",
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T15:30:00.000Z"
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Booking not found"
}
```

**cURL Example**:
```bash
curl -X PATCH http://localhost:5002/api/bookings/507f1f77bcf86cd799439021/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

---

## Health Check Endpoint

### 12. Health Check

**Endpoint**: `GET /health`

**Description**: Check if the backend server is running

**Request Headers**: None required

**Request Payload**: None

**Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

**cURL Example**:
```bash
curl http://localhost:5002/health
```

---

## Authentication

Currently, the API endpoints do not require authentication tokens. However, JWT tokens are returned during registration and login. To add authentication middleware, you would typically:

1. Include the token in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

2. Verify the token in protected routes using middleware

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:
```json
{
  "message": "Error description"
}
```

**401 Unauthorized**:
```json
{
  "message": "Invalid credentials"
}
```

**404 Not Found**:
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Error description"
}
```

---

## Notes

- All dates should be in ISO 8601 format (e.g., `2024-02-01T00:00:00.000Z`)
- MongoDB ObjectIds are 24-character hexadecimal strings
- The JWT token expires after 7 days
- All timestamps are automatically added by Mongoose (`createdAt`, `updatedAt`)
- The API uses CORS and accepts JSON content type

