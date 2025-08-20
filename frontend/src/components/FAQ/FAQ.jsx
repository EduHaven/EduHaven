import React, { useState } from 'react';
import './FAQ.css';
import { HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null); // Only one expanded at a time

  // Dummy FAQ data
  const faqData = [
    {
      id: 1,
      question: "How do I place an order?",
      answer: "Browse our menu, add items to cart, and proceed to checkout. We accept cards, digital wallets, and cash on delivery."
    },
    {
      id: 2,
      question: "What are your delivery times?",
      answer: "Standard delivery is 30-45 minutes. Track your order in real-time through our app."
    },
    {
      id: 3,
      question: "Do you offer vegetarian options?",
      answer: "Yes, we have extensive vegetarian and vegan options. Filter by dietary preferences in our menu."
    },
    {
      id: 4,
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled within 5 minutes. Contact support for later cancellations."
    },
    {
      id: 5,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, digital wallets (PayPal, Apple Pay, Google Pay), and cash on delivery."
    },
    {
      id: 6,
      question: "Is there a minimum order amount?",
      answer: "Minimum $10 for delivery orders. No minimum for pickup orders."
    },
    {
      id: 7,
      question: "Do you offer loyalty rewards?",
      answer: "Join our loyalty program to earn points on every order. Redeem for discounts on future orders."
    },
    {
      id: 8,
      question: "How do I report an issue?",
      answer: "Contact our customer support immediately through the app, website, or support line."
    }
  ];

  // Filter FAQ items based on search term
  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle expanded item
  const toggleItem = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="faq-section" id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <HelpCircle size={32} className="faq-icon" />
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions</p>
        </div>
        
        <div className="faq-search">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="faq-search-input"
            />
          </div>
        </div>

        <div className="faq-list">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item) => (
              <div key={item.id} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => toggleItem(item.id)}
                >
                  <h3>{item.question}</h3>
                  {expandedId === item.id ? 
                    <ChevronUp size={20} className="faq-toggle" /> : 
                    <ChevronDown size={20} className="faq-toggle" />
                  }
                </div>
                <div className={`faq-answer ${expandedId === item.id ? 'expanded' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No questions found matching your search.</p>
              <p>Try different keywords or browse all questions.</p>
            </div>
          )}
        </div>

        <div className="faq-footer">
          <p>Still have questions? Contact our support team for personalized assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
