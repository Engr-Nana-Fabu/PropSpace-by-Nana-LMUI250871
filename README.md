# PropSpace - Property Listing Application

PropSpace is a full-stack web application that allows users to list, view, update, and delete properties for rent or sale. Built with modern technologies, it includes user authentication, dynamic search filters, a user dashboard for property management, and comprehensive account management features.

## Features

### User & Authentication
- ✅ User registration with email validation
- ✅ Secure password hashing using bcryptjs
- ✅ JWT-based authentication
- ✅ Secure login state management
- ✅ Protected routes with authentication guards

### Account Management
- ✅ User profile management (update username, phone, avatar)
- ✅ Secure password changes with verification
- ✅ Profile viewing and editing

### Property Listings Management
- ✅ Create properties with title, description, price, location, type, and images
- ✅ Public property feed accessible to all users
- ✅ Search and filter properties by city and price range
- ✅ Private "My Listings" page for authenticated users
- ✅ Update property details (authors only)
- ✅ Delete properties (authors only)
- ✅ Server-side ownership validation

## Tech Stack

### Frontend
- **Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: Bootstrap 5
- **HTTP Client**: Angular HttpClient with Interceptors
- **State Management**: RxJS Observables
- **Routing**: Angular Router with Guards
- **Forms**: Reactive Forms with Validation

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs (salting & hashing)
- **Environment Management**: dotenv

### Database
- **MongoDB**: NoSQL database for flexible data modeling
- **Schema Design**: Optimized with references for user-property relationships

## Project Structure

```
PropSpace/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── controllers/           # Business logic handlers
│   │   ├── middleware/            # Custom middleware
│   │   ├── models/                # Mongoose schemas
│   │   ├── repositories/          # Data access layer
│   │   ├── routes/                # API route definitions
│   │   └── services/              # Business logic layer
│   ├── server.js                  # Server entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── app.component.ts   # Root component
    │   │   ├── app.config.ts      # Application configuration
    │   │   ├── app.routes.ts      # Route definitions
    │   │   ├── core/              # Core services and guards
    │   │   ├── features/          # Feature components
    │   │   └── shared/            # Shared components
    │   └── main.ts                # Bootstrap
    ├── angular.json
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas connection string)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGO_URI=mongodb://localhost:27017/propspace
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will open at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/change-password` - Change password (protected)

### Properties
- `GET /api/properties` - Get all properties with optional filters
- `GET /api/properties/my-listings` - Get user's listings (protected)
- `POST /api/properties` - Create new property (protected)
- `PUT /api/properties/:id` - Update property (protected, owner only)
- `DELETE /api/properties/:id` - Delete property (protected, owner only)

## Query Parameters

### Property Listing Filters
- `city` - Filter by city name
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

Example:
```
GET /api/properties?city=NewYork&minPrice=100000&maxPrice=500000
```

## Architecture Best Practices

### Backend
- **Routes Layer**: Handles HTTP request parsing and delegation
- **Controller Layer**: Manages HTTP responses and error handling
- **Service Layer**: Implements business logic and validations
- **Repository Layer**: Abstracts database operations
- **Middleware**: Cross-cutting concerns (authentication, logging)

### Frontend
- **Component Modularity**: Reusable, single-responsibility components
- **Service Layer**: Centralized API communication
- **Guard Protection**: Route-level authentication enforcement
- **Interceptors**: Global HTTP request/response handling
- **Reactive Forms**: Form validation and state management
- **Memory Management**: Proper subscription cleanup with takeUntil()

## Error Handling & HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input or validation error
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks permission (e.g., editing others' properties)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Token validation on protected routes
- ✅ CORS enabled for frontend communication
- ✅ Secure route guards in frontend
- ✅ Server-side ownership validation
- ✅ Input validation on both client and server

## Usage Examples

### Register a New User
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Create a Property
```javascript
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beautiful 2-Bedroom Apartment",
  "description": "Spacious apartment in downtown area",
  "price": 250000,
  "city": "New York",
  "country": "USA",
  "propertyType": "Apartment",
  "imageUrls": ["https://example.com/img1.jpg"]
}
```

## Deployment

### Frontend Deployment (Vercel, Netlify, GitHub Pages)
```bash
cd frontend
npm run build
```

The optimized build will be in the `dist` directory.

### Backend Deployment (Heroku, Railway, DigitalOcean)
1. Ensure all environment variables are set
2. Push to your hosting provider
3. Start the server with: `npm start`

## Contributing

When contributing to PropSpace:

1. Create a new branch for your feature
2. Follow the established project structure
3. Write clean, well-commented code
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## License

This project is part of an academic assessment and is provided as-is.

## Support

For issues or questions, please refer to the project documentation or contact the development team.

## Submission

This project is submitted as a complete full-stack application demonstrating:
- ✅ Complete full-stack application
- ✅ User authentication and authorization
- ✅ Property CRUD operations
- ✅ Search and filter functionality
- ✅ User dashboard
- ✅ Profile management
- ✅ Secure password handling
- ✅ Production-grade error handling
- ✅ RESTful API design
- ✅ Clean code architecture