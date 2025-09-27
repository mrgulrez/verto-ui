# 🧠 Verto Quiz Application

A modern, responsive quiz application built with React.js and Tailwind CSS, featuring comprehensive user authentication, admin panel, and real-time quiz functionality.

![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.13-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite)
![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=for-the-badge&logo=axios)

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [Admin Panel](#-admin-panel)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Development](#-development)
- [Contributing](#-contributing)
- [Contact](#-contact)

## ✨ Features

### 🎯 Core Quiz Features
- **Interactive Quiz Interface**: Modern, responsive quiz taking experience
- **Real-time Timer**: Configurable countdown timer for each question
- **Question Navigation**: Easy navigation between questions with progress tracking
- **Instant Results**: Immediate feedback with detailed score breakdown
- **Session Management**: Persistent quiz sessions with unique session IDs
- **Anonymous Support**: Take quizzes without registration (with optional username)

### 🔐 Authentication System
- **User Registration**: Complete user registration with validation
- **User Login**: Secure authentication with JWT tokens
- **Profile Management**: Edit user profile and change passwords
- **Token Management**: Automatic token refresh and secure storage
- **Role-based Access**: Different access levels for users and staff
- **Session Persistence**: Maintains login state across browser sessions

### 👨‍💼 Admin Panel
- **Dashboard Overview**: Comprehensive admin dashboard with statistics
- **Quiz Configuration**: Real-time quiz settings management
- **User Management**: View and manage user accounts and permissions
- **Quiz Statistics**: Detailed analytics and performance metrics
- **Question Management**: View and analyze individual question performance
- **Attempt Tracking**: Monitor all quiz attempts with detailed information
- **Debug Tools**: Advanced debugging and system monitoring

### 🎨 User Interface
- **Modern Design**: Clean, professional UI with gradient backgrounds
- **Responsive Layout**: Fully responsive design for all device sizes
- **Dark/Light Themes**: Adaptive color schemes for better user experience
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Accessibility**: WCAG compliant design with keyboard navigation

### 🔧 Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Axios Interceptors**: Automatic token refresh and request handling
- **Context API**: Global state management for authentication
- **Protected Routes**: Route protection based on authentication status
- **Error Boundaries**: Comprehensive error handling and recovery
- **Performance Optimization**: Lazy loading and code splitting

## 📸 Screenshots

### Landing Page
- Modern gradient background with quiz information cards
- User authentication buttons with professional styling
- Responsive design for all screen sizes

### Quiz Interface
- Clean question display with multiple choice options
- Real-time timer and progress tracking
- Smooth transitions between questions

### Admin Panel
- Comprehensive dashboard with statistics
- Tabbed interface for different admin functions
- Real-time data updates and monitoring

### Authentication
- Separate login flows for users and admins
- Professional modal designs with validation
- Secure credential management

## 🚀 Installation

### Prerequisites
- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Backend API server running (Django REST API)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/verto-quiz-ui.git
cd verto-quiz-ui
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Verto Quiz
VITE_APP_VERSION=1.0.0
```

### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Configuration

### API Configuration
The API configuration is located in `src/config/api.js`:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000,
  ENDPOINTS: {
    // Quiz endpoints
    QUIZ_CONFIG: '/quiz/config/',
    QUIZ_QUESTIONS: '/quiz/',
    QUIZ_SUBMIT: '/quiz/submit/',
    
    // Authentication endpoints
    AUTH_LOGIN: '/auth/login/',
    AUTH_REGISTER: '/auth/register/',
    AUTH_LOGOUT: '/auth/logout/',
    AUTH_REFRESH: '/auth/refresh/',
    AUTH_PROFILE: '/auth/profile/',
    
    // Admin endpoints
    ADMIN_STATS: '/admin/stats/',
    ADMIN_ATTEMPTS: '/admin/attempts/',
    ADMIN_QUESTION_STATS: '/admin/question-stats/',
    ADMIN_CONFIG_UPDATE: '/quiz/config/update/'
  }
};
```

### Tailwind CSS Configuration
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
```

## 📖 Usage

### For Regular Users

#### 1. Taking a Quiz
1. Visit the application homepage
2. Click "Start Quiz" to begin
3. Answer questions within the time limit
4. View your results and score

#### 2. User Registration/Login
1. Click "Login / Register" button
2. Choose between login or registration
3. Fill in your details and submit
4. Access your profile and quiz history

#### 3. Profile Management
1. Login to your account
2. Click "Edit Profile" to modify your information
3. Change your password if needed
4. Update your personal details

### For Administrators

#### 1. Admin Access
1. Click "Admin Panel" button
2. Use admin credentials to login
3. Access the comprehensive admin dashboard

#### 2. Quiz Configuration
1. Navigate to "Configuration" tab
2. Update quiz settings in real-time
3. Enable/disable quiz and adjust timer
4. Save changes to apply immediately

#### 3. Monitoring and Analytics
1. View "Statistics" for overall performance
2. Check "Attempts" for detailed user data
3. Analyze "Questions" for individual performance
4. Use "Debug" tools for system monitoring

## 🔌 API Integration

### Authentication Flow
```javascript
// Login
const response = await authService.login(username, password);
const { user, tokens } = response;

// Token Management
tokenManager.setTokens(tokens.access, tokens.refresh);

// Automatic Token Refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshToken();
      return authApi(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### Quiz Submission
```javascript
// Submit Quiz with Username
const submissionData = {
  answers: { "1": 1, "2": 6, "3": 9 },
  time_taken: 300,
  session_id: 'unique_session_id',
  username: 'optional_username'
};

const result = await quizService.submitQuizAnswers(submissionData);
```

### Admin Data Fetching
```javascript
// Get Quiz Statistics
const stats = await quizService.getQuizStats();

// Get Question Statistics
const questionStats = await quizService.getQuestionStats();

// Get Quiz Attempts
const attempts = await quizService.getQuizAttempts();
```

## 🔐 Authentication

### User Authentication
- **Registration**: Complete user registration with email verification
- **Login**: Secure JWT-based authentication
- **Profile Management**: Update user information and passwords
- **Session Persistence**: Maintains login state across browser sessions

### Admin Authentication
- **Staff Login**: Separate admin login with staff privilege validation
- **Role-based Access**: Different access levels for users and administrators
- **Secure Credentials**: Test credentials provided for development

### Test Credentials
```
Admin Username: adminuser
Admin Password: admin123
```

### Token Management
- **Access Tokens**: Short-lived tokens for API requests
- **Refresh Tokens**: Long-lived tokens for token renewal
- **Automatic Refresh**: Seamless token refresh on expiration
- **Secure Storage**: Tokens stored securely in localStorage

## 👨‍💼 Admin Panel

### Dashboard Features
- **Real-time Statistics**: Live quiz performance metrics
- **User Management**: View and manage user accounts
- **Quiz Configuration**: Real-time quiz settings management
- **Analytics**: Detailed performance analytics and insights

### Configuration Management
- **Quiz Settings**: Enable/disable quiz and adjust timer
- **Question Management**: View and analyze question performance
- **User Permissions**: Manage user access and privileges
- **System Monitoring**: Debug tools and system health checks

### Data Visualization
- **Score Distribution**: Visual representation of quiz scores
- **Time Analytics**: Average time taken per question
- **User Engagement**: Track user participation and performance
- **Question Difficulty**: Analyze question performance metrics

## 📁 Project Structure

```
verto-ui/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AdminLoginForm.jsx      # Admin authentication form
│   │   ├── AdminPanel.jsx          # Admin dashboard and management
│   │   ├── AuthWrapper.jsx         # Authentication wrapper component
│   │   ├── LoadingSpinner.jsx      # Loading animation component
│   │   ├── LoginForm.jsx           # User login form
│   │   ├── ProfileEdit.jsx         # User profile editing
│   │   ├── ProtectedRoute.jsx      # Route protection component
│   │   ├── QuizView.jsx            # Quiz taking interface
│   │   ├── RegisterForm.jsx        # User registration form
│   │   ├── ResultsScreen.jsx       # Quiz results display
│   │   └── StartScreen.jsx         # Landing page component
│   ├── config/
│   │   └── api.js                  # API configuration and endpoints
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication context provider
│   ├── hooks/
│   │   ├── useCountdown.js         # Timer hook for quiz
│   │   └── useSession.js           # Session management hook
│   ├── services/
│   │   ├── authService.js          # Authentication service
│   │   └── quizService.js          # Quiz data service
│   ├── utils/
│   ├── App.css                     # Global styles
│   ├── App.jsx                     # Main application component
│   ├── index.css                   # Tailwind CSS imports
│   └── main.jsx                    # Application entry point
├── .env                            # Environment variables
├── .gitignore                      # Git ignore rules
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML template
├── package.json                    # Project dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── vite.config.js                  # Vite configuration
```

## 🛠️ Technologies Used

### Frontend
- **React 19.1.1**: Modern React with latest features
- **Vite 7.1.7**: Fast build tool and development server
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **Axios 1.12.2**: HTTP client for API requests

### Development Tools
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic vendor prefixing
- **React Hooks**: Modern React state management

### Backend Integration
- **Django REST API**: Backend API server
- **JWT Authentication**: Secure token-based authentication
- **RESTful APIs**: RESTful API design patterns
- **CORS Support**: Cross-origin resource sharing

## 🚀 Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Development Guidelines
1. **Code Style**: Follow ESLint configuration
2. **Component Structure**: Use functional components with hooks
3. **State Management**: Use Context API for global state
4. **Styling**: Use Tailwind CSS utility classes
5. **API Integration**: Use Axios for all API calls

### Adding New Features
1. Create components in `src/components/`
2. Add services in `src/services/`
3. Update API configuration in `src/config/api.js`
4. Add new routes in `src/App.jsx`
5. Update authentication context if needed

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📞 Contact

**Developer**: Gulrez Alam  
**Email**: egulrezalam@gmail.com  
**Project**: Verto Quiz Application  
**Version**: 1.0.0  

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the fast build tool
- Django REST Framework for the backend API
- All contributors and testers

---

**Made with ❤️ by Gulrez Alam**