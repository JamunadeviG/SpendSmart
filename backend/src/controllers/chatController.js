const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Store chat histories (in production, use Redis or database)
const chatHistories = new Map();

// Generate a unique session ID
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get or create chat history for a session
const getChatHistory = (sessionId) => {
  if (!chatHistories.has(sessionId)) {
    chatHistories.set(sessionId, []);
  }
  return chatHistories.get(sessionId);
};

// Send message to Gemini and get streaming response
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    // Use provided sessionId or generate new one
    const currentSessionId = sessionId || generateSessionId();
    const chatHistory = getChatHistory(currentSessionId);

    // Add user message to history
    chatHistory.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    // Start chat session with history
    const chat = model.startChat({
      history: chatHistory.slice(0, -1), // Exclude the current message
    });

    // Set up Server-Sent Events for streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    let fullResponse = '';

    try {
      // Send message and get streaming result
      const result = await chat.sendMessageStream(message.trim());
      
      // Send sessionId first
      res.write(`data: ${JSON.stringify({ sessionId: currentSessionId, type: 'session' })}\n\n`);

      // Stream the response
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        
        res.write(`data: ${JSON.stringify({ 
          content: chunkText, 
          type: 'chunk' 
        })}\n\n`);
      }

      // Add assistant response to history
      chatHistory.push({
        role: 'model',
        parts: [{ text: fullResponse }]
      });

      // Send completion signal
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      
      // Handle rate limiting
      if (geminiError.message?.includes('429') || geminiError.message?.includes('quota')) {
        res.write(`data: ${JSON.stringify({ 
          type: 'error', 
          message: 'Rate limit exceeded. Please try again in a few moments.' 
        })}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify({ 
          type: 'error', 
          message: 'Sorry, I encountered an error. Please try again.' 
        })}\n\n`);
      }
    }

    res.end();

  } catch (error) {
    console.error('Chat Controller Error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
};

// Clear chat history for a session
exports.clearHistory = (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId && chatHistories.has(sessionId)) {
      chatHistories.delete(sessionId);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

// Get chat history for a session
exports.getHistory = (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const history = getChatHistory(sessionId);
    res.json({ history });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
};
