# Community Connect Lost & Found

A comprehensive lost and found management system built with React.js, Node.js, Express, and MongoDB.

## 🚀 Features

### Core Features
- **Lost & Found Item Management** - Report and track lost/found items
- **Multi-Organization Support** - Each organization has its own space
- **Role-Based Access Control** - User, Admin, and Super Admin roles
- **Advanced Search & Filtering** - Find items quickly with multiple filters
- **Real-time Updates** - Live status updates and notifications
- **Image Upload** - Support for multiple images per item
- **Reward System** - Set and track rewards for found items

### Admin Features
- **Organization Management** - Create and manage organizations
- **User Management** - Add, edit, and manage users
- **Item Verification** - Verify and resolve reported items
- **Analytics Dashboard** - View statistics and reports
- **Bulk Operations** - Import/export data

### User Features
- **Profile Management** - Update personal information
- **Item History** - View all reported items
- **Notifications** - Get updates on item status
- **Contact Information** - Safe contact sharing

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd community-connect-lost-found
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/lost-found-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Run the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

#### Production Mode
```bash
# Build the frontend
npm run build

# Start the server
npm run server
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📊 Database Schema

### Items Collection
```javascript
{
  type: 'lost' | 'found',
  title: String,
  description: String,
  location: String,
  date: Date,
  status: 'active' | 'resolved' | 'claimed',
  reward: Number,
  images: [String],
  category: String,
  color: String,
  brand: String,
  reporter: ObjectId (ref: User),
  organization: ObjectId (ref: Organization),
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  tags: [String],
  resolvedBy: ObjectId (ref: User),
  resolvedAt: Date,
  notes: String
}
```

### Users Collection
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: 'user' | 'admin' | 'super_admin',
  organization: ObjectId (ref: Organization),
  status: 'active' | 'inactive' | 'suspended',
  avatar: String,
  phone: String,
  address: Object,
  preferences: Object,
  lastLogin: Date,
  emailVerified: Boolean
}
```

### Organizations Collection
```javascript
{
  name: String,
  code: String (unique),
  type: 'school' | 'university' | 'company' | 'community' | 'other',
  description: String,
  location: Object,
  contact: Object,
  settings: Object,
  status: 'active' | 'inactive' | 'suspended',
  createdBy: ObjectId (ref: User),
  logo: String,
  theme: Object,
  statistics: Object
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: ObjectId,
  iat: Number,
  exp: Number
}
```

### Role Permissions

#### User Role
- View and report items
- Update own profile
- View own items

#### Admin Role
- All user permissions
- Manage organization users
- Verify and resolve items
- View organization statistics

#### Super Admin Role
- All admin permissions
- Create and manage organizations
- Manage all users across organizations
- System-wide statistics

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `PATCH /api/items/:id/resolve` - Resolve item

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get organization
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

## 🔧 Configuration

### MongoDB Connection
The application connects to MongoDB using the `MONGODB_URI` environment variable. Make sure MongoDB is running and accessible.

### JWT Secret
Change the `JWT_SECRET` in production to a strong, unique secret key.

### File Upload
Currently, the application uses placeholder images. To implement file upload:

1. Set up a cloud storage service (AWS S3, Cloudinary, etc.)
2. Update the upload endpoint in `server.js`
3. Configure the frontend to handle file uploads

## 🧪 Testing

### Manual Testing
1. Start the application
2. Register a new organization
3. Create admin and user accounts
4. Test item reporting and management
5. Verify role-based access control

### API Testing
Use tools like Postman or curl to test the API endpoints:

```bash
# Test API health
curl http://localhost:5000/

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🚀 Deployment

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for production

### Backend Deployment
1. Set up a MongoDB instance (MongoDB Atlas recommended)
2. Deploy the Node.js server to your hosting service
3. Configure environment variables
4. Set up a reverse proxy (nginx) if needed

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-found-app
JWT_SECRET=your-production-secret-key
PORT=5000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the MongoDB connection
2. Verify environment variables
3. Check the console for error messages
4. Ensure all dependencies are installed

For additional support, please open an issue in the repository. 