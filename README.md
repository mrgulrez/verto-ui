# Quiz Challenge - React Frontend

A modern, responsive quiz application built with React 19, Vite, and Tailwind CSS. This frontend connects to a backend API to provide a complete quiz experience with admin panel functionality.

## Features

- 🧠 **Interactive Quiz Interface**: Beautiful, responsive quiz with timer and navigation
- ⚙️ **Admin Panel**: Complete admin dashboard with statistics and configuration
- 📊 **Real-time Analytics**: Track attempts, scores, and question performance
- 🎯 **Session Management**: Persistent session tracking for quiz attempts
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🎨 **Modern UI**: Beautiful design with Tailwind CSS and smooth animations
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.13
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Vite with React plugin
- **Linting**: ESLint with React hooks plugin

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000` (or configure via environment variables)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd verto-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_DEFAULT_TIMER_DURATION=10
   VITE_DEFAULT_MAX_ATTEMPTS=1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application connects to the following backend endpoints:

- `GET /api/quiz/` - Fetch quiz questions
- `GET /api/quiz/config/` - Get quiz configuration
- `POST /api/quiz/config/update/` - Update quiz settings
- `POST /api/quiz/submit/` - Submit quiz answers
- `GET /api/admin/attempts/` - Get quiz attempts
- `GET /api/admin/stats/` - Get quiz statistics
- `GET /api/admin/question-stats/` - Get question performance stats

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.jsx   # Admin dashboard
│   ├── LoadingSpinner.jsx
│   ├── QuizView.jsx     # Quiz interface
│   ├── ResultsScreen.jsx
│   └── StartScreen.jsx
├── hooks/              # Custom React hooks
│   ├── useCountdown.js
│   └── useSession.js
├── services/           # API service layer
│   └── quizService.js
├── config/            # Configuration files
│   └── api.js
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## Features Overview

### Quiz Interface
- Timer countdown with automatic submission
- Question navigation (previous/next)
- Answer selection with visual feedback
- Progress tracking
- Responsive design

### Admin Panel
- Quiz configuration management
- Real-time statistics dashboard
- Attempt history and analytics
- Question performance metrics
- Score distribution analysis

### Error Handling
- Graceful fallback to mock data when API is unavailable
- Comprehensive error messages
- Loading states and user feedback

## Development

### Code Style
- ESLint configuration with React hooks rules
- Consistent code formatting
- Component-based architecture

### Adding New Features
1. Create components in `src/components/`
2. Add API methods in `src/services/quizService.js`
3. Update configuration in `src/config/api.js`
4. Add custom hooks in `src/hooks/` if needed

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** for production API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is part of the GSSoC (GirlScript Summer of Code) program.
