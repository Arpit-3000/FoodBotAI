import { useEffect, useRef, useState, useCallback } from 'react';
import { FiSend, FiPaperclip, FiMic, FiMicOff, FiSmile, FiZap, FiMoreVertical, FiChevronDown } from 'react-icons/fi';
import { BsCheck2All, BsThreeDotsVertical } from 'react-icons/bs';

const ChatBox = ({ response, onNewMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your FoodBOT AI Assistant. How can I help you create a lead today?",
      sender: 'ai',
      name: 'FoodBOT',
      avatar: 'FB',
      timestamp: new Date().toISOString(),
      status: 'read'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add new response to messages when received
  useEffect(() => {
    if (response) {
      if (response.loading) {
        // Show typing indicator immediately
        setIsTyping(true);
      } else {
        // Add the actual response message
        const newMessage = {
          id: Date.now(),
          text: formatResponse(response),
          sender: 'ai',
          name: 'FoodBOT',
          avatar: 'FB',
          timestamp: new Date().toISOString(),
          status: 'delivered',
          data: response
        };
        
        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);
      }
    }
  }, [response]);

  // Track the last final transcript to prevent duplicates
  const lastFinalTranscript = useRef('');

  // Toggle speech recognition
  const toggleSpeechRecognition = useCallback(async () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          console.log('Stopping speech recognition...');
          // Set a flag to prevent error handling from showing alerts during normal stop
          recognitionRef.current.isStopping = true;
          recognitionRef.current.stop();
          console.log('Speech recognition stopped');
        } catch (e) {
          console.error('Error stopping recognition:', e);
        } finally {
          recognitionRef.current = null;
          setIsListening(false);
          lastFinalTranscript.current = ''; // Reset when stopping
        }
      }
    } else {
      console.log('Starting speech recognition...');
      
      // Check browser support first
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or another supported browser.');
        return;
      }

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop all tracks to release the microphone immediately
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Microphone access denied:', err);
        alert('Microphone access is required for voice input. Please allow microphone access in your browser settings.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      console.log('SpeechRecognition API available:', !!SpeechRecognition);

      try {
        // Initialize new recognition instance
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        // Configure recognition settings
        recognition.continuous = true;     // Keep listening until stopped
        recognition.interimResults = true; // Get interim results
        recognition.maxAlternatives = 1;   // Only one alternative result
        recognition.lang = 'en-US';        // Using US English for better compatibility
        
        console.log('Speech recognition configured with settings:', {
          continuous: recognition.continuous,
          interimResults: recognition.interimResults,
          lang: recognition.lang
        });
      
        // Handle recognition results
        recognition.onresult = (event) => {
          console.log('Speech recognition result:', event);
          let interimTranscript = '';
          let finalTranscript = lastFinalTranscript.current;
          
          // Process all results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (!result || !result[0]) continue;
            
            const transcript = result[0].transcript || '';
            
            if (result.isFinal) {
              finalTranscript = finalTranscript ? `${finalTranscript} ${transcript}` : transcript;
              lastFinalTranscript.current = finalTranscript.trim();
            } else {
              interimTranscript = transcript;
            }
          }
          
          // Update input field with the combined transcripts
          const displayText = finalTranscript + (interimTranscript ? ` ${interimTranscript}` : '');
          setInputMessage(displayText.trim());
          
          // Auto-stop after a complete sentence
          if (finalTranscript.trim().match(/[.!?]$/)) {
            console.log('Complete sentence detected, stopping recognition');
            toggleSpeechRecognition();
          }
        };
        
        // Handle recognition errors
        recognition.onerror = (event) => {
          // Skip error handling if we're in the process of stopping
          if (recognition.isStopping) {
            console.log('Recognition stopping, ignoring error:', event.error);
            return;
          }
          
          console.error('Speech recognition error:', event.error, event);
          
          // Don't show alerts for aborted errors as they're usually not user-facing
          if (event.error === 'aborted') {
            console.log('Speech recognition was aborted, likely due to normal stop operation');
            return;
          }
          
          setIsListening(false);
          
          let errorMessage = 'Error with speech recognition. ';
          
          switch(event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access is blocked. Please allow microphone access in your browser settings and refresh the page.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone found. Please ensure a microphone is connected and working.';
              break;
            case 'language-not-supported':
              errorMessage = 'The selected language is not supported. Please try with English.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your internet connection.';
              break;
            case 'no-speech':
              // Don't show an alert for no-speech as it's not really an error
              console.log('No speech detected');
              return;
            case 'service-not-allowed':
              errorMessage = 'Speech recognition service is not allowed. Please check your browser settings.';
              break;
            default:
              errorMessage += `Error code: ${event.error}. Please try again.`;
          }
          
          console.log('Speech recognition error details:', {
            error: event.error,
            message: event.message,
            time: new Date().toISOString()
          });
          
          // Only show alert for important errors
          if (!['aborted', 'no-speech'].includes(event.error)) {
            alert(errorMessage);
          }
        };
        
        // Handle when recognition ends
        recognition.onend = () => {
          console.log('Speech recognition ended');
          if (isListening) {
            console.log('Restarting speech recognition...');
            try {
              recognition.start();
            } catch (e) {
              console.error('Error restarting recognition:', e);
              setIsListening(false);
            }
          }
        };
        
        // Start recognition
        recognition.start();
        setIsListening(true);
        console.log('Speech recognition started');
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        alert(`Failed to initialize speech recognition: ${error.message}`);
      }
    }
  }, [isListening]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error cleaning up recognition:', e);
        }
      }
    };
  }, []);

  const toggleVoiceInput = useCallback(() => {
    toggleSpeechRecognition();
  }, [toggleSpeechRecognition]);

  // Format response for display
  const formatResponse = (res) => {
    // Handle error responses
    if (res.error || (res.mcpResponse && (res.mcpResponse.error || res.mcpResponse.error))) {
      const error = res.error || (res.mcpResponse?.error?.message || res.mcpResponse?.error || res.mcpResponse?.error);
      const missingFields = res.missingFields || [];
      
      let message = `❌ ${error || 'An error occurred'}\n\n`;
      
      // Handle specific error cases
      if (res.error === 'Lead ID is required' || error?.includes('ID is required') || res.mcpResponse?.error?.includes('ID is required')) {
        message += 'Please provide a Lead ID. Example commands:\n';
        message += '• "Update lead ID 123 with email john@example.com"\n';
        message += '• "Delete lead ID 456"\n';
        message += '• "Show me details for lead ID 789"';
      } else if (missingFields.length > 0) {
        message += 'Missing required fields:\n';
        message += missingFields.map(field => `• ${field}`).join('\n');
      } else if (res.mcpResponse?.error?.details) {
        // Handle validation errors
        message += 'Validation errors:\n';
        message += Object.entries(res.mcpResponse.error.details)
          .map(([field, error]) => `• ${field}: ${error}`)
          .join('\n');
      }
      
      return message;
    }
    
    // Handle successful responses
    if (res.mcpResponse?.data) {
      // Check if this is a delete operation
      if (res.mcpResponse.data.message?.includes('deleted')) {
        return `✅ ${res.mcpResponse.data.message || 'Lead deleted successfully!'}`;
      }
      
      // Format lead data in a more readable way
      const formatLeadData = (data) => {
        if (!data) return '';
        
        // Handle array of leads
        if (Array.isArray(data)) {
          if (data.length === 0) return 'No leads found.';
          return data.map((lead, index) => `Lead ${index + 1}:\n${formatLeadData(lead)}`).join('\n\n');
        }
        
        // Format single lead
        const lead = data;
        const lines = [];
        
        // Add ID if exists
        if (lead.id) lines.push(`ID: ${lead.id}`);
        
        // Add name if exists
        if (lead.name) lines.push(`Name: ${lead.name}`);
        
        // Add contact info if exists
        if (lead.contact) {
          if (lead.contact.email) lines.push(`Email: ${lead.contact.email}`);
          if (lead.contact.phone) lines.push(`Phone: ${lead.contact.phone}`);
        }
        
        // Add other fields if they exist
        if (lead.source) lines.push(`Source: ${lead.source}`);
        if (lead.status) lines.push(`Status: ${lead.status}`);
        if (lead.notes) lines.push(`Notes: ${lead.notes}`);
        
        // Add interested products if they exist
        if (lead.interestedProducts?.length > 0) {
          lines.push(`Interested Products: ${lead.interestedProducts.join(', ')}`);
        }
        
        // Add timestamp if it exists
        if (lead.createdAt) {
          const date = new Date(lead.createdAt).toLocaleString();
          lines.push(`Created: ${date}`);
        } else if (lead.updatedAt) {
          const date = new Date(lead.updatedAt).toLocaleString();
          lines.push(`Last Updated: ${date}`);
        }
        
        return lines.join('\n');
      };
      
      const formattedData = formatLeadData(res.mcpResponse.data);
      return `✅ Lead processed successfully!\n\n${formattedData}`;
    }
    
    // Handle direct success messages (like from delete operations)
    if (res.message) {
      if (res.message.includes('deleted')) {
        return `✅ ${res.message}`;
      }
      return `✅ ${res.message}`;
    }
    
    // Default case - stringify the response
    return JSON.stringify(res, null, 2);
  };

  const enhancePrompt = useCallback(async () => {
    const textToEnhance = inputMessage.trim();
    if (!textToEnhance) {
      console.log('No text to enhance');
      return;
    }
    
    console.log('Enhancing prompt:', textToEnhance);
    setIsEnhancing(true);
    
    try {
      // Simple enhancement - you can expand this with more sophisticated logic
      let enhancedText = textToEnhance;
      
      // 1. Capitalize first letter
      if (enhancedText.length > 0) {
        enhancedText = enhancedText[0].toUpperCase() + enhancedText.slice(1);
        
        // 2. Add period if missing at the end
        if (!['.', '!', '?'].includes(enhancedText[enhancedText.length - 1])) {
          enhancedText += '.';
        }
        
        // 3. Fix common typos (example)
        enhancedText = enhancedText
          .replace(/\bnam eis\b/gi, 'name is')
          .replace(/\bcreeate\b/gi, 'create');
      }
      
      console.log('Setting enhanced text:', enhancedText);
      setInputMessage(enhancedText);
      
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  }, [inputMessage]);

  // Check if the message is a greeting
  const isGreeting = (message) => {
    if (!message) return false;
    const greetings = ['hi', 'hello', 'hey', 'yo', 'hi there', 'hello there', 'hey there', "what's up", 'wassup', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetings.includes(message.toLowerCase().trim());
  };

  const sendMessage = () => {
    const message = inputMessage.trim();
    if (!message) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      name: 'You',
      avatar: 'U',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Update messages and clear input
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Check if it's a greeting
    if (isGreeting(message)) {
      // Add greeting response directly
      const greetingResponse = {
        id: Date.now() + 1,
        text: "Hi there! I'm your FoodBOT AI Assistant. How can I help you today?\n\nYou can ask me to:\n• Create a new lead\n• Update a lead\n• Delete a lead\n• View all leads",
        sender: 'ai',
        name: 'FoodBOT',
        avatar: 'FB',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, greetingResponse]);
      return; // Don't send to backend
    }
    
    // Send to parent component for processing
    onNewMessage(message);
  };
  
  const handleSubmit = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    sendMessage();
    return false;
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };
  
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessageContent = (message) => {
    return message.text.split('\n').map((line, i, arr) => (
      <div key={i} className="whitespace-pre-wrap">
        {line}
        {i < arr.length - 1 && <br />}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold mr-3">
            FB
          </div>
          <div>
            <h2 className="font-semibold text-lg">FoodBOT Assistant</h2>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              <span className="text-xs text-blue-100">Online</span>
            </div>
          </div>
        </div>
        {/* <div className="flex items-center space-x-4">
          <button className="text-white/80 hover:text-white p-1">
          
          
          </button>
          <button className="text-white/80 hover:text-white p-1">
            
          </button>
        </div> */}
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] bg-opacity-30 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat">
        <div className="w-full max-w-3xl mx-auto space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium mr-2 self-end mb-1">
                  {message.avatar}
                </div>
              )}
              <div className="max-w-[80%] relative">
                <div 
                  className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="font-medium text-xs text-blue-600 mb-1">{message.name}</div>
                  )}
                  <div className="text-sm">{renderMessageContent(message)}</div>
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    <span className="text-xs">{formatTime(message.timestamp)}</span>
                    {message.sender === 'user' && (
                      <span className="text-sm">
                        {message.status === 'read' ? (
                          <BsCheck2All className="text-blue-300" />
                        ) : (
                          <BsCheck2All className="text-gray-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div 
                  className={`absolute top-0 w-3 h-3 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 right-0 -mr-1.5 transform rotate-45' 
                      : 'bg-white left-0 -ml-1.5 transform -rotate-45'
                  }`}
                ></div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 p-2 bg-white rounded-full w-24 shadow-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center space-x-2 mb-1">
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <FiSmile className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <FiPaperclip className="h-5 w-5" />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              enhancePrompt();
            }}
            disabled={!inputMessage.trim() || isEnhancing}
            className={`p-2 rounded-full ${
              !inputMessage.trim() || isEnhancing 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-purple-600 hover:bg-purple-50'
            }`}
            title="Enhance prompt"
          >
            <FiZap className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-white rounded-full border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Type a message..."}
              className="w-full px-4 py-2 bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400"
              autoFocus
            />
          </div>
          <button
            onClick={toggleVoiceInput}
            className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <FiMicOff className="h-5 w-5" /> : <FiMic className="h-5 w-5" />}
          </button>
          <button
            onClick={handleButtonClick}
            disabled={!inputMessage.trim()}
            className={`p-2 rounded-full ${
              inputMessage.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            } transition-colors`}
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
