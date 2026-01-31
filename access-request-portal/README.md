# Access Request Management Portal

A full-stack web application for managing access requests with JWT authentication, role-based access control, and database persistence.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Role-Based Access Control**: Two user roles (REQUESTER and APPROVER)
- **Access Request Management**: Submit, view, approve, and reject access requests
- **Business Rule Enforcement**: One pending request per user at a time
- **Database Persistence**: All data stored in MongoDB
- **Modern UI**: Premium, responsive design with dark mode and animations

## Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- Express Validator for input validation

### Frontend
- React 18
- Vite
- React Router DOM
- Axios for API calls
- Modern CSS with animations

## Project Structure

```
access-request-portal/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth and role check
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── .env
│   └── package.json
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/access-request-portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user info (protected)

### Access Requests
- `POST /api/requests` - Create access request (REQUESTER only)
- `GET /api/requests/my-requests` - Get user's requests (REQUESTER)
- `GET /api/requests/all` - Get all requests (APPROVER only)
- `PUT /api/requests/:id/approve` - Approve request (APPROVER only)
- `PUT /api/requests/:id/reject` - Reject request (APPROVER only)

## User Roles

### REQUESTER
- Register and log in
- Submit access requests
- View own request status
- Limited to one pending request at a time

### APPROVER
- Log in to the system
- View all access requests from all users
- Approve or reject requests
- Cannot submit access requests

## Business Rules

⚠️ **Critical**: A user can have only one pending access request at any given time. If a pending request exists, new requests will be rejected with an error message.

## Usage

1. **Register** a new account with either REQUESTER or APPROVER role
2. **Login** with your credentials
3. **REQUESTER Dashboard**:
   - Fill out the access request form
   - Submit your request
   - View your request status
4. **APPROVER Dashboard**:
   - View all pending requests
   - Review request details
   - Approve or reject requests

## Security Features

- Passwords hashed with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Environment variables for sensitive data
- CORS enabled for frontend communication

## Development

### Backend Development Mode
```bash
cd backend
npm run dev
```

### Frontend Development Mode
```bash
cd frontend
npm run dev
```

## License

This project is for educational purposes.
