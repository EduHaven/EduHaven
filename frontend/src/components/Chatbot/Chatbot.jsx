import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, X, MessageCircle, ChefHat } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';
import './Chatbot.css';


const Chatbot = () => {
  const { cartItems } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    taste: '',
    timeOfDay: '',
    mood: '',
    dietaryPreferences: '',
    specificIngredients: ''
  });
  
  // Check if cart has items to adjust chatbot positioning
  const hasCartItems = Object.values(cartItems).reduce((sum, item) => sum + item, 0) > 0;
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_KEY = 'YOUR_API_KEY';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  const questions = [
    { key: 'taste', question: "What taste profile do you prefer? (e.g., spicy, sweet, savory, tangy, mild)" },
    { key: 'timeOfDay', question: "What time of day is it? (breakfast, lunch, dinner, snack)" },
    { key: 'mood', question: "How are you feeling today? (energetic, tired, happy, stressed, cozy)" },
    { key: 'dietaryPreferences', question: "Any dietary preferences? (vegetarian, vegan, gluten-free, none)" },
    { key: 'specificIngredients', question: "Any specific ingredients you'd like to include? (e.g., paneer, mushrooms, spinach, chicken, tofu, etc.)" }
  ];

  // Function to format bot messages with markdown-like formatting
  const formatBotMessage = (text) => {
    if (!text) return '';
    
    // Split by lines to handle line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Format bold text (**text**)
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Format italic text (*text*)
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Format numbered lists (1. text)
      formattedLine = formattedLine.replace(/^(\d+)\.\s+(.+)$/, '<span class="list-item"><span class="list-number">$1.</span> $2</span>');
      
      // Format bullet points (- text or • text)
      formattedLine = formattedLine.replace(/^[-•]\s+(.+)$/, '<span class="list-item"><span class="list-bullet">•</span> $1</span>');
      
      // Add emoji formatting
      formattedLine = formattedLine.replace(/🍽️|👋|💖|🔥|😋|🌟/g, '<span class="emoji">$&</span>');
      
      return (
        <p key={lineIndex} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      setMessages([
        {
          type: 'bot',
          content: "👋 Hi! I'm your **Foodie AI assistant**! I'll help you discover the perfect food based on your preferences. Let's start with a few questions..."
        }
      ]);
    }
  }, [isOpen]);

  const generateFoodSuggestions = async () => {
    setIsLoading(true);
    
    const prompt = `Based on the following preferences, suggest 5 specific food items with brief descriptions:

Taste: ${userPreferences.taste}
Time of Day: ${userPreferences.timeOfDay}
Mood: ${userPreferences.mood}
Dietary Preferences: ${userPreferences.dietaryPreferences}
Specific Ingredients: ${userPreferences.specificIngredients}

Please provide exactly 5 food suggestions in this format:
1. **[Food Name]** - [Brief description of why it matches their preferences]
2. **[Food Name]** - [Brief description of why it matches their preferences]
3. **[Food Name]** - [Brief description of why it matches their preferences]
4. **[Food Name]** - [Brief description of why it matches their preferences]
5. **[Food Name]** - [Brief description of why it matches their preferences]

Make the suggestions specific, appetizing, and relevant to their preferences. Use **bold** for food names and make the descriptions engaging.`;

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const suggestions = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, {
          type: 'bot',
          content: suggestions
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "Sorry, I'm having trouble generating suggestions right now. Please try again!"
      }]);
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
      setUserPreferences({
        taste: '',
        timeOfDay: '',
        mood: '',
        dietaryPreferences: '',
        specificIngredients: ''
      });
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage
    }]);

    if (currentStep < questions.length) {
      // Store user's answer
      const currentQuestion = questions[currentStep];
      setUserPreferences(prev => ({
        ...prev,
        [currentQuestion.key]: userMessage
      }));

      // Move to next question or generate suggestions
      if (currentStep === questions.length - 1) {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: "Perfect! Let me analyze your preferences and suggest some **delicious options** for you... 🍽️"
        }]);
        setTimeout(generateFoodSuggestions, 1000);
      } else {
        const nextQuestion = questions[currentStep + 1];
        setMessages(prev => [...prev, {
          type: 'bot',
          content: nextQuestion.question
        }]);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setUserPreferences({
      taste: '',
      timeOfDay: '',
      mood: '',
      dietaryPreferences: '',
      specificIngredients: ''
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      resetChat();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button with tooltip and accessibility*/}
      <div className="chatbot-tooltip-wrapper">
        <button
          className="chatbot-toggle"
          onClick={toggleChat}
          title="Chat with us"
          aria-label="Chat with us"
          tabIndex="0"
          data-tooltip="Chat with us"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`chatbot-container ${hasCartItems ? 'with-cart' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-title">
              <ChefHat size={20} />
              <span>Foodie AI Assistant</span>
            </div>
            <button className="chatbot-close" onClick={toggleChat}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'bot' ? formatBotMessage(message.content) : (
                    message.content.split('\n').map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentStep < questions.length ? "Type your answer..." : "Ask me anything about food..."}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="send-button"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 