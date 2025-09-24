# Gemini-Powered Chatbot Integration

This document outlines the integration of a Gemini-powered AI chatbot into the SpendSmart application.

## 🚀 Features Implemented

### ✅ Backend Features
- **Secure Proxy Endpoint**: `/chat/send` - Forwards user messages to Gemini API
- **Streaming Responses**: Server-Sent Events (SSE) for real-time message streaming
- **Session Management**: Maintains chat history per session
- **Error Handling**: Comprehensive error handling for rate limits and API failures
- **Chat History**: Endpoints to get and clear chat history

### ✅ Frontend Features
- **Floating Chat Button**: Bottom-right corner with smooth animations
- **Chat Panel**: Modal-style chat interface with message history
- **Real-time Streaming**: Live message streaming with typing indicators
- **Responsive Design**: Mobile-friendly chat interface
- **Theme Integration**: Consistent with existing app theme (light/dark mode)
- **Error Handling**: User-friendly error messages for connection issues

## 📁 Files Added/Modified

### Backend Files
```
backend/
├── src/
│   ├── controllers/
│   │   └── chatController.js          # NEW: Chat logic and Gemini integration
│   ├── routes/
│   │   └── chat.js                   # NEW: Chat API routes
│   └── server.js                     # MODIFIED: Added chat routes
├── package.json                      # MODIFIED: Added @google/generative-ai
└── .env.example                      # NEW: Environment variable template
```

### Frontend Files
```
components/
└── chatbot/
    ├── chatbot.tsx                   # NEW: Main chatbot component
    ├── chat-panel.tsx               # NEW: Chat interface
    ├── floating-button.tsx          # NEW: Floating chat button
    ├── message.tsx                  # NEW: Message component
    └── typing-indicator.tsx         # NEW: Typing animation

app/
└── layout.tsx                       # MODIFIED: Added chatbot integration
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Add your Gemini API key to the backend environment:

```bash
# In backend/.env
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### 2. Install Dependencies

The Gemini SDK has been installed. If you need to reinstall:

```bash
cd backend
npm install @google/generative-ai
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🎯 API Endpoints

### POST `/chat/send`
Sends a message to Gemini and streams the response.

**Request:**
```json
{
  "message": "How can I save money?",
  "sessionId": "optional-session-id"
}
```

**Response:** Server-Sent Events stream with:
- `type: "session"` - Contains sessionId
- `type: "chunk"` - Contains partial response content
- `type: "done"` - End of response
- `type: "error"` - Error message

### POST `/chat/clear`
Clears chat history for a session.

**Request:**
```json
{
  "sessionId": "session-id-to-clear"
}
```

### GET `/chat/history?sessionId=...`
Retrieves chat history for a session.

## 🎨 UI Components

### FloatingButton
- Positioned at bottom-right corner
- Changes icon when chat is open/closed
- Smooth hover animations

### ChatPanel
- 400px width, 500px height
- Message history with auto-scroll
- Input field with send button
- Clear history button
- Typing indicator during AI response

### Message
- User messages: Right-aligned with primary color
- AI messages: Left-aligned with muted background
- Icons for user (User) and AI (Bot)

## 🔒 Security Features

- **API Key Protection**: Gemini API key stored server-side only
- **Input Validation**: Message validation on both client and server
- **Rate Limiting**: Built-in error handling for Gemini rate limits
- **CORS**: Proper CORS configuration for cross-origin requests

## 🎭 Theme Integration

The chatbot automatically adapts to your app's theme:
- **Light Mode**: Uses primary colors and muted backgrounds
- **Dark Mode**: Automatically switches with system/theme toggle
- **Consistent Styling**: Uses existing CSS variables and design tokens

## 🚨 Error Handling

### Client-Side Errors
- Connection failures
- Invalid responses
- Network timeouts

### Server-Side Errors
- Gemini API rate limits
- Invalid API key
- Network issues
- Malformed requests

All errors are displayed as user-friendly messages in the chat interface.

## 🔄 Session Management

- **Automatic Session Creation**: New sessions created automatically
- **Session Persistence**: Chat history maintained during the session
- **Session Clearing**: Users can clear history manually
- **Memory Management**: In-memory storage (consider Redis for production)

## 📱 Mobile Responsiveness

- Chat panel adapts to screen size
- Touch-friendly interface
- Proper keyboard handling on mobile devices

## 🚀 Future Enhancements

Consider these improvements for production:

1. **Database Storage**: Store chat history in MongoDB
2. **Redis Caching**: Use Redis for session management
3. **Authentication**: Link chats to user accounts
4. **Rate Limiting**: Implement per-user rate limiting
5. **Analytics**: Track chat usage and popular queries
6. **Context Awareness**: Provide financial context to Gemini
7. **File Uploads**: Support for receipt/image analysis

## 🧪 Testing

Test the chatbot by:
1. Starting both frontend and backend servers
2. Opening the app in your browser
3. Clicking the chat button (bottom-right)
4. Sending a test message like "Hello" or "How can I budget better?"

The response should stream in real-time with a typing indicator.

## 📞 Support

If you encounter issues:
1. Check that the backend server is running on port 4000
2. Verify your GEMINI_API_KEY is set correctly
3. Check browser console for any JavaScript errors
4. Verify network requests in browser DevTools
