# Vyzo - Short Video App MVP

Welcome to Vyzo, a TikTok-style short video mobile app built with Expo, React Native, FastAPI, and MongoDB.

## Features Implemented

### User Authentication
- Email/Password registration and login
- JWT token-based authentication
- Secure password hashing
- User profile management

### Video Feed
- Swipe-able vertical video feed
- Auto-play videos
- Sample videos pre-loaded (5 videos)
- Smooth animations and gestures
- Pull-to-refresh feed

### Video Interactions
- Like/Unlike videos with animated heart button
- View count tracking
- Watch time recording
- Real-time engagement metrics

### Comments System
- Add comments to videos
- View all comments on a video
- Comments associated with users
- Real-time comment count updates

### Smart Recommendations
- Rule-based recommendation algorithm
- Prioritizes unwatched videos
- Ranks by engagement score (likes, comments, views)
- Personalized feed based on watch history

### Profile Screen
- View user information
- Logout functionality
- Settings menu (UI ready for future features)

## Tech Stack

### Frontend
- **Expo** - React Native framework
- **React Native** - Cross-platform mobile development
- **Expo Router** - File-based routing
- **Expo AV** - Video playback
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local data persistence

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **PyJWT** - JWT authentication

## Getting Started

### Prerequisites
- The app is already running in the Emergent environment
- Backend API: http://localhost:8001
- Frontend: Accessible via Expo tunnel

### Test Credentials
Create a new account via the registration screen, or use these test endpoints:

```bash
# Register a new user
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@vyzo.com",
    "password": "password123",
    "username": "vyzouser",
    "bio": "Video enthusiast"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Videos
- `GET /api/videos/feed` - Get personalized video feed
- `POST /api/videos/{video_id}/view` - Record video view

### Likes
- `POST /api/videos/{video_id}/like` - Like a video
- `DELETE /api/videos/{video_id}/like` - Unlike a video

### Comments
- `GET /api/videos/{video_id}/comments` - Get video comments
- `POST /api/videos/{video_id}/comments` - Add a comment

## Project Structure

```
/app
├── backend/
│   ├── server.py          # FastAPI backend with all endpoints
│   ├── .env               # Environment variables
│   └── requirements.txt   # Python dependencies
└── frontend/
    ├── app/               # Expo Router pages
    │   ├── index.tsx      # Auth screen
    │   ├── _layout.tsx    # Root layout
    │   └── (tabs)/        # Tab navigation
    ├── screens/           # Screen components
    │   ├── LoginScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── FeedScreen.tsx
    │   └── ProfileScreen.tsx
    ├── components/        # Reusable components
    │   ├── VideoPlayer.tsx
    │   └── CommentsModal.tsx
    ├── contexts/          # React contexts
    │   └── AuthContext.tsx
    └── utils/             # Utilities
        └── api.ts         # API client
```

## Sample Videos

The app comes with 5 pre-loaded sample videos from Google's public video repository:
1. Big Buck Bunny
2. Elephants Dream
3. For Bigger Blazes
4. For Bigger Escapes
5. For Bigger Fun

## Future Enhancements

### Phase 2 Features
- Video upload functionality
- Advanced AI-powered recommendations
- Video search and discovery
- Follow/Unfollow users
- User-generated content feed
- Share videos to social media

### Phase 3 Features
- Live streaming
- Video editing tools
- Monetization features
- Analytics dashboard
- Push notifications
- Direct messaging

## Mobile Testing

The app is designed for mobile devices. To test on your phone:

1. Install Expo Go app on your device
2. Scan the QR code from the Expo tunnel
3. The app will load on your device

## Backend Testing

All backend endpoints have been tested and are fully functional:
- ✅ User registration and login
- ✅ JWT authentication
- ✅ Video feed with recommendations
- ✅ Like/Unlike functionality
- ✅ Comments system
- ✅ Watch history tracking

## Notes

- The app uses MongoDB for data persistence
- JWT tokens expire after 7 days
- Videos are streamed from external URLs (not stored locally for MVP)
- The recommendation algorithm prioritizes unwatched videos
- All API requests require authentication (except register/login)

## Support

For any issues or questions, please refer to the Emergent platform documentation or contact support.

---

Built with ❤️ using Emergent AI Platform
