# Proactive Education Assistant Chatbot

A comprehensive chatbot component that provides intelligent assistance to users across all pages of the Proactive Education Assistant platform.

## Features

### 🎯 Core Functionality
- **Floating Chat Button**: Circular, draggable button positioned at the bottom-right corner of all pages
- **Intelligent Responses**: Rule-based chatbot that answers questions about the platform
- **Multi-page Presence**: Available on all screens and pages of the application
- **Theme Support**: Adapts to both light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 User Interface
- **Draggable Interface**: Users can move the chat button to their preferred position
- **Smooth Animations**: Hover effects, scaling, and transitions for better UX
- **Minimize/Maximize**: Chat interface can be minimized to save screen space
- **Real-time Messaging**: Instant responses with typing indicators
- **Message History**: Maintains conversation context

### 🧠 AI Capabilities
- **Intent Recognition**: Understands user queries about features, pricing, support, etc.
- **Contextual Responses**: Provides relevant answers based on user questions
- **Fallback Handling**: Gracefully handles unknown queries
- **Extensible Knowledge Base**: Easy to add new intents and responses

## Components

### Chatbot.jsx
The main chatbot component with:
- Floating button with drag functionality
- Chat interface with message history
- Knowledge base for intelligent responses
- Theme integration

### train_chatbot.py
Python script for training an AI model (optional enhancement):
- Machine learning-based intent classification
- TF-IDF vectorization for text processing
- Logistic regression for intent prediction
- Model persistence with pickle

## Usage

### Basic Implementation
```jsx
import Chatbot from './components/chatbot/Chatbot';

// Add to your main App component
function App() {
  return (
    <div>
      {/* Your app content */}
      <Chatbot />
    </div>
  );
}
```

### Customization
The chatbot can be customized by:
- Modifying the `knowledgeBase` object for new intents
- Adding responses to the `responses` object
- Changing the visual styling and colors
- Adjusting the position and behavior

## Knowledge Base

The chatbot currently understands and responds to:

### Greetings
- Hello, hi, hey, good morning, etc.

### About Queries
- What is Proactive Education Assistant?
- Purpose and functionality

### Features
- Platform capabilities and features
- What the app can do

### Pricing
- Cost information and subscription details
- Current offers and discounts

### Payment
- Payment methods and processes
- Billing information

### Support
- Help and assistance
- Contact information

## Technical Details

### Dependencies
- React hooks (useState, useEffect, useRef)
- Lucide React icons
- Theme context integration
- Tailwind CSS for styling

### Python Dependencies (for AI training)
- scikit-learn
- numpy
- pandas (optional)

## Future Enhancements

### AI Integration
- Integration with OpenAI GPT models
- Advanced natural language processing
- Context-aware conversations

### Advanced Features
- File upload support
- Voice messages
- Multi-language support
- Integration with helpdesk systems

### Analytics
- Conversation tracking
- User behavior analysis
- Popular query identification

## Installation & Setup

1. **React Component**: Already integrated into the main App.jsx
2. **Python Training** (optional):
   ```bash
   pip install scikit-learn numpy
   python src/components/chatbot/train_chatbot.py
   ```

## File Structure
```
src/components/chatbot/
├── Chatbot.jsx          # Main chatbot component
├── train_chatbot.py     # AI training script
└── README.md           # This documentation
```

## Contributing

To extend the chatbot:
1. Add new intents to the `knowledgeBase` object
2. Create corresponding responses in the `responses` object
3. Test the new functionality
4. Update this documentation

## Support

For chatbot-related issues or enhancements, please contact the development team or create an issue in the project repository.