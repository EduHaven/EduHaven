# AI Food Assistant Chatbot

## Overview
The AI Food Assistant is a chatbot powered by Google's Gemini 2.0 Flash model that helps users discover perfect food recommendations based on their preferences. The chatbot is positioned in the bottom-right corner of the website and provides personalized food suggestions.

## Features

### 1. Interactive Chat Interface
- **Position**: Bottom-right corner, below the scroll-to-top button
- **Toggle**: Click the message icon to open/close the chat
- **Design**: Modern, responsive design with smooth animations

### 2. Preference-Based Recommendations
The chatbot asks users 4 key questions to understand their preferences:

1. **Taste Profile**: What taste do you prefer? (spicy, sweet, savory, tangy, mild)
2. **Time of Day**: What time is it? (breakfast, lunch, dinner, snack)
3. **Mood**: How are you feeling? (energetic, tired, happy, stressed, cozy)
4. **Dietary Preferences**: Any dietary restrictions? (vegetarian, vegan, gluten-free, none)

### 3. AI-Powered Suggestions
- Uses Google Gemini 2.0 Flash API
- Generates 5 personalized food recommendations
- Each suggestion includes a brief description explaining why it matches user preferences
- Structured, easy-to-read output format

### 4. User Experience Features
- **Real-time Typing Indicator**: Shows when AI is generating responses
- **Smooth Scrolling**: Auto-scrolls to latest messages
- **Enter Key Support**: Send messages with Enter key
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Adapts to system theme preferences

## Technical Implementation

### API Integration
- **Model**: Gemini 2.0 Flash (`gemini-2.0-flash-exp`)
- **Endpoint**: Google Generative AI API
- **Authentication**: API key-based authentication
- **Error Handling**: Graceful fallback for API failures

### State Management
- **Conversation Flow**: Step-by-step question progression
- **User Preferences**: Stored temporarily during session
- **Message History**: Maintains conversation context
- **Loading States**: Visual feedback during API calls

### Components
1. **Chatbot.jsx**: Main chatbot component with all logic
2. **Chatbot.css**: Comprehensive styling with animations
3. **App.jsx**: Integration into main application

## Usage Flow

1. **Open Chat**: Click the message icon in bottom-right corner
2. **Answer Questions**: Respond to 4 preference questions
3. **Get Recommendations**: Receive 5 personalized food suggestions
4. **Continue Chat**: Ask follow-up questions or start over

## API Configuration

### Environment Setup
- API Key: Hardcoded for demo purposes
- Model: `gemini-2.0-flash-exp`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

### Prompt Engineering
The AI receives a structured prompt including:
- User's taste preferences
- Time of day context
- Current mood
- Dietary restrictions
- Output format requirements

## Styling Features

### Visual Design
- **Gradient Backgrounds**: Orange-red theme matching app colors
- **Rounded Corners**: Modern, friendly appearance
- **Shadow Effects**: Depth and elevation
- **Smooth Transitions**: Professional animations

### Responsive Behavior
- **Desktop**: 380px width, 500px height
- **Mobile**: Full-width with adjusted height
- **Touch-Friendly**: Large touch targets for mobile

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Color Contrast**: High contrast for readability
- **Focus Indicators**: Clear focus states

## Future Enhancements

### Potential Improvements
1. **Food Database Integration**: Connect with actual menu items
2. **User History**: Remember previous preferences
3. **Image Generation**: Add food images to suggestions
4. **Voice Input**: Speech-to-text capabilities
5. **Multi-language Support**: Internationalization
6. **Analytics**: Track popular preferences and suggestions

### Advanced Features
1. **Recipe Suggestions**: Include cooking instructions
2. **Nutritional Info**: Add health and nutrition data
3. **Restaurant Recommendations**: Suggest nearby places
4. **Social Sharing**: Share favorite suggestions
5. **Personalization**: Learn from user behavior over time 