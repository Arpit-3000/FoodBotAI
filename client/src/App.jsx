import { useState, useRef, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const App = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  
  const toggleChat = () => {
    const willShowChat = !showChat;
    setShowChat(willShowChat);
    
    if (willShowChat) {
      // Reset chat state when opening the chat
      setResponse(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const startNewChat = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setResponse(null); // Clear any previous responses
    setShowChat(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewMessage = async (message) => {
    // Set loading state immediately
    setResponse({ loading: true });
    
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}api/ai-agent/parse-and-create`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ conversation: message }),
});
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse({
        error: error.message || 'Failed to send message',
        timestamp: new Date().toISOString()
      });
    } finally {
      // No need to set loading to false as it will be replaced by the actual response
    }
  };

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Advanced AI understands and processes lead information intelligently.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Process leads and get responses in real-time.'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Your data is encrypted and handled with the utmost security.'
    },
    {
      icon: '🔄',
      title: 'Seamless Integration',
      description: 'Easily integrates with your existing workflow.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30"></div>
        </div>
      </div>

      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold mr-2">FB</div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">FoodBOT</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium transition-colors">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 font-medium transition-colors">Contact</a>
            </nav>
            <div className="flex items-center">
              <button 
                onClick={toggleChat}
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                {showChat ? 'Back to Home' : 'Get Started'}
              </button>
              <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {!showChat ? (
          <>
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Transform Your Food Business</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">With AI-Powered Lead Management</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Streamline your lead generation and customer interactions with our intelligent AI assistant designed specifically for the food industry.
              </p>
              <div className="mt-8 flex justify-center
              ">
                <div className="inline-flex rounded-md shadow">
                  <button 
                    onClick={startNewChat}
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 md:py-4 md:text-lg md:px-10 transition-all transform hover:-translate-y-0.5"
                  >
                    Start Chatting Now
                  </button>
                </div>
                <div className="ml-3 inline-flex">
                  <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors">
                    Learn More
                  </a>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { number: '10K+', label: 'Leads Processed' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'Support' },
                { number: '5min', label: 'Average Response Time' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Powerful Features
                </h2>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                  Everything you need to manage your food business leads effectively
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                  <div key={index} className="pt-6">
                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                      <div className="-mt-6">
                        <div className="inline-flex items-center justify-center p-3 rounded-md shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl w-12 h-12">
                          {feature.icon}
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                        <p className="mt-2 text-base text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-extrabold mb-6">Ready to get started?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Join thousands of businesses already using our AI assistant to streamline their lead generation process.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={toggleChat}
                  className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Chatting Now
                </button>
                <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
            </section>
          </>
        ) : (
          <section id="chat" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <ChatBox response={response} onNewMessage={handleNewMessage} />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      {!showChat && (
        <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-4 xl:col-span-1">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-2">FB</div>
                <span className="text-white text-xl font-bold">FoodBOT</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering food businesses with AI-powered lead management solutions.
              </p>
              <div className="flex space-x-6 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <FiGithub className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <FiLinkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <FiTwitter className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    {['Lead Management', 'Customer Support', 'Order Processing', 'Analytics'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    {['Documentation', 'Guides', 'API Status', 'Contact'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    {['Privacy', 'Terms', 'Cookie Policy', 'GDPR'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} FoodBOT AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default App;
