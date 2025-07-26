import { useEffect, useRef } from 'react';

const ChatBox = ({ response }) => {
  const responseEndRef = useRef(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when response updates
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  if (!response) return null;
  
  // Background pattern as a separate component to avoid JSX syntax issues
  const BackgroundPattern = () => (
    <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l-5.374 5.373 1.415 1.414L58.456 0zM.29 59.708l5.375-5.374-1.415-1.414L0 58.294zM58.456 0l-3.782 3.782-1.414-1.414L56.042 0zM0 56.042l3.782-3.782-1.414-1.414L0 53.214zM56.042 0l-5.374 5.374 1.414 1.414L59.87 0zM0 59.87l5.374-5.374-1.414-1.414L0 56.042zM59.708.29l-5.374 5.375 1.414 1.414L59.708 3.13zM3.13 60l5.375-5.374-1.414-1.414L3.13 56.042zM60 3.13l-5.374 5.375 1.414 1.414L60 5.958zM5.958 60l5.374-5.374-1.414-1.414L5.958 56.042zM60 5.958l-3.782 3.782 1.414 1.414L60 9.2zM9.2 60l3.782-3.782-1.414-1.414L9.2 56.042zM60 9.2l-5.374 5.374 1.414 1.414L60 12.456zM12.456 60l5.374-5.374-1.414-1.414L12.456 56.042zM60 12.456l-5.374 5.374 1.414 1.414L60 15.714zM15.714 60l5.374-5.374-1.414-1.414L15.714 56.042zM60 15.714l-5.374 5.374 1.414 1.414L60 18.972zM18.972 60l5.374-5.374-1.414-1.414L18.972 56.042zM60 18.972l-5.374 5.374 1.414 1.414L60 22.23zM22.23 60l5.374-5.374-1.414-1.414L22.23 56.042zM60 22.23l-5.374 5.374 1.414 1.414L60 25.488zM25.488 60l5.374-5.374-1.414-1.414L25.488 56.042zM60 25.488l-5.374 5.374 1.414 1.414L60 28.746zM28.746 60l5.374-5.374-1.414-1.414L28.746 56.042zM60 28.746l-5.374 5.374 1.414 1.414L60 32.004zM32.004 60l5.374-5.374-1.414-1.414L32.004 56.042zM60 32.004l-5.374 5.374 1.414 1.414L60 35.262zM35.262 60l5.374-5.374-1.414-1.414L35.262 56.042zM60 35.262l-5.374 5.374 1.414 1.414L60 38.52zM38.52 60l5.374-5.374-1.414-1.414L38.52 56.042zM60 38.52l-5.374 5.374 1.414 1.414L60 41.778zM41.778 60l5.374-5.374-1.414-1.414L41.778 56.042zM60 41.778l-5.374 5.374 1.414 1.414L60 45.036zM45.036 60l5.374-5.374-1.414-1.414L45.036 56.042zM60 45.036l-5.374 5.374 1.414 1.414L60 48.294zM48.294 60l5.374-5.374-1.414-1.414L48.294 56.042zM60 48.294l-5.374 5.374 1.414 1.414L60 51.552zM51.552 60l5.374-5.374-1.414-1.414L51.552 56.042zM60 51.552l-5.374 5.374 1.414 1.414L60 54.81zM54.81 60l5.374-5.374-1.414-1.414L54.81 56.042zM60 54.81l-5.374 5.374 1.414 1.414L60 58.082zM58.082 60l1.332-1.332-.943-.943-1.332 1.332z' fill='%234f46e5' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      backgroundSize: '60px 60px'
    }} />
  );

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 transform hover:shadow-2xl">
      {/* AI Agent Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center">
        <BackgroundPattern />
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex-shrink-0 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10a1 1 0 01-1.64 0l-7-10A1 1 0 012 7h5V2a1 1 0 01.7-.954 1 1 0 01.6 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">FoodBOT AI Assistant</h3>
            <p className="text-blue-100 text-sm flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Generating response...
            </p>
          </div>
        </div>
        <div className="ml-auto flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
        </div>
      </div>
      
      {/* AI Response Content */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
        <div className="pl-6 pr-5 py-6">
          <div className="prose prose-sm max-w-none text-gray-800">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-inner overflow-x-auto">
              <code className="text-gray-800">{response}</code>
            </pre>
          </div>
          
          {/* AI Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex space-x-2">
              <button 
                type="button"
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="Copy to clipboard"
                onClick={() => navigator.clipboard.writeText(response)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </button>
              <button 
                type="button"
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                title="Download response"
                onClick={() => {
                  const blob = new Blob([response], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ai-response-${new Date().toISOString()}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-400">
              <span>AI • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div ref={responseEndRef} />
    </div>
  );
};

export default ChatBox;
