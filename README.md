# 📊 Meeting Notes Analyzer

AI-powered meeting transcript analysis tool built with React, Node.js, Express, MongoDB, and Claude AI.

## ✨ Features

- 🤖 **AI-Powered Analysis** - Extract summaries, action items, decisions, and dates
- 🔐 **Authentication** - Secure JWT-based user authentication
- 📊 **Analytics Dashboard** - Visualize meeting trends with Chart.js
- 📤 **File Upload** - Upload .txt meeting transcripts
- 🎯 **Action Item Tracking** - Priority-based task management
- 🏷️ **Smart Tagging** - Auto-generated tags for meetings
- 📱 **Responsive Design** - Beautiful dark theme UI

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or Atlas)
- Anthropic API Key ([Get one here](https://console.anthropic.com/))

### Installation

#### 1. Clone/Download the project

```bash
cd meeting-notes-clean
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/meeting-notes-analyzer
JWT_SECRET=your_super_secret_jwt_key_here_change_this
ANTHROPIC_API_KEY=your_anthropic_api_key_here
FRONTEND_URL=http://localhost:3000
```

Start MongoDB (if local):
```bash
# Mac with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

Start backend:
```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on port 5001
```

#### 3. Setup Frontend

Open a NEW terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will open at: **http://localhost:3000**

## 📖 Usage

1. **Register** - Create an account at `/register`
2. **Login** - Sign in at `/login`
3. **Upload** - Go to `/upload` and upload a `.txt` meeting transcript
4. **View Analysis** - AI extracts summary, action items, decisions, dates
5. **Dashboard** - See all your meetings at `/dashboard`
6. **Analytics** - View charts and statistics at `/analytics`

## 🗂️ Project Structure

```
meeting-notes-clean/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── services/         # AI service
│   ├── server.js         # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── context/      # Auth context
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Meetings
- `POST /api/meetings/upload` - Upload & analyze meeting
- `GET /api/meetings` - Get all user meetings
- `GET /api/meetings/:id` - Get single meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `GET /api/meetings/analytics/data` - Get analytics

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios
- Chart.js + react-chartjs-2

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Anthropic Claude AI
- Multer (file upload)

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/meeting-notes-analyzer
JWT_SECRET=your_secret_key
ANTHROPIC_API_KEY=your_api_key
FRONTEND_URL=http://localhost:3000
```

## 📝 Sample Meeting Transcript

Create a file `sample-meeting.txt`:

```
Team Standup - December 28, 2024

Sarah: Good morning team. Let's start with updates.

John: I completed the user authentication feature. It's ready for review by Friday.

Sarah: Excellent. Mike, what's your status?

Mike: I'm working on the analytics dashboard. Should be done by next Monday. I need help with the Chart.js integration though.

Sarah: Okay, I'll assign Lisa to help you with that. Lisa, can you pair with Mike tomorrow?

Lisa: Sure, I'll block out 2-3pm tomorrow for that.

Sarah: Perfect. We also need to schedule a client demo for January 5th. Everyone mark your calendars.

John: Will do. One more thing - we decided to use MongoDB instead of PostgreSQL for better scalability.

Sarah: Good decision. Meeting adjourned.
```

## 🐛 Troubleshooting

**Backend won't start:**
- Make sure MongoDB is running
- Check if port 5001 is available: `lsof -i:5001`
- Verify `.env` file exists with correct values

**Frontend won't start:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available
- Clear browser cache

**Login not working:**
- Make sure both backend AND frontend are running
- Check browser console for errors
- Verify proxy in `frontend/package.json` is `"http://localhost:5001"`

## 📄 License

MIT

## 🤝 Support

For issues or questions, check the troubleshooting section above.
