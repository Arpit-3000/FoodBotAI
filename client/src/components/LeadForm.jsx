import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function LeadForm({ onResponse }) {
  const [conversation, setConversation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [conversation]);

  const formatErrorResponse = (errorData) => {
    if (!errorData) return 'An error occurred. Please try again.';
    
    let errorMessage = 'Validation Error:\n\n';
    
    if (errorData.missingFields) {
      errorMessage += '• ' + errorData.missingFields.join('\n• ') + '\n\n';
    }
    
    if (errorData.requiredFields) {
      errorMessage += 'Required Fields:\n';
      errorMessage += JSON.stringify(errorData.requiredFields, null, 2) + '\n\n';
    }
    
    if (errorData.example) {
      errorMessage += 'Example:\n';
      errorMessage += JSON.stringify(errorData.example, null, 2);
    }
    
    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!conversation.trim()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post("http://localhost:7000/api/ai-agent/parse-and-create", { 
        conversation 
      }, {
        validateStatus: (status) => true // Don't throw for any status code
      });

      console.log('API Response:', res.data);
      
      // If we got a successful response (2xx)
      if (res.status >= 200 && res.status < 300) {
        onResponse(res.data);
      } 
      // If we got a client error (4xx)
      else if (res.status >= 400 && res.status < 500) {
        setError(res.data.error || 'Validation error');
        // Format the error response in a way the ChatBox can understand
        onResponse({
          error: res.data.error || 'Validation error',
          missingFields: res.data.missingFields || [],
          example: res.data.example
        });
      }
      // Server error (5xx) or other
      else {
        throw new Error(res.data?.error || 'Server error');
      }
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errorMessage);
      
      // Send error to ChatBox in a consistent format
      onResponse({
        error: errorMessage,
        missingFields: err.response?.data?.missingFields || []
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            rows={4}
            value={conversation}
            onChange={(e) => setConversation(e.target.value)}
            placeholder="Paste conversation or type your message here..."
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !conversation.trim()}
            className={`inline-flex items-center px-6 py-2.5 rounded-xl text-white font-medium shadow-sm transition-all duration-200 ${
              isLoading || !conversation.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Generate Lead'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
