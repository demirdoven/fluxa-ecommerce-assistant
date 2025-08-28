import { useState, useRef, useEffect } from 'react';

const Chatbox = () => {
  const [messages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
    { id: 2, text: 'I\'m looking for product recommendations', sender: 'user' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullSize, setIsFullSize] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);

  // Handle click outside to minimize
  useEffect(() => {
    if (isMinimized) return; // Don't add click handlers when minimized
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMinimizedIcon = target.closest('.chatbox-minimized-icon');
      
      // If clicking on minimized icon, don't do anything
      if (isMinimizedIcon) return;
      
      // If clicking outside the chatbox
      if (chatboxRef.current && !chatboxRef.current.contains(target)) {
        // if (isFullSize) {
        //   setIsFullSize(false);
        // } else if (isExpanded) {
        //   setIsExpanded(false);
        // }

        setIsFullSize(false);
        setIsExpanded(false);
        setIsMinimized(true);
      }
    };

    if (isExpanded || isFullSize) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isFullSize, isMinimized]);

  const toggleFullSize = () => {
    setIsFullSize(!isFullSize);
  };

  const handleMinimize = () => {
    if (isMinimized) {
      // If already minimized, restore to expanded state
      setIsMinimized(false);
      setIsExpanded(true);
    } else {
      // If not minimized, minimize it
      setIsMinimized(true);
      setIsExpanded(false);
      setIsFullSize(false);
    }
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsExpanded(true);
  };

  // Show minimized chat icon
  if (isMinimized) {
    return (
      <div 
        className="chatbox-minimized-icon fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-[9999]"
        style={{
          animation: 'bounceIn 0.4s ease-out forwards',
          opacity: 0,
          transform: 'scale(0.5) translateY(20px)'
        }}
        onClick={handleRestore}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* Blur overlay when expanded */}
      {(isExpanded || isFullSize) && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[9998]"
          style={{
            animation: 'fadeIn 0.2s ease-out forwards',
            opacity: 0
          }}
          onClick={() => isFullSize ? toggleFullSize() : setIsExpanded(false)}
        />
      )}
      
      <div 
        ref={chatboxRef}
        className={`fixed bg-white rounded-xl shadow-xl flex flex-col ${
          isFullSize 
            ? 'w-3/4 h-[80vh] z-[9999]'
            : isExpanded 
              ? 'w-96 h-[600px] z-[9999]' 
              : 'w-96 h-16 overflow-hidden z-[9999]'
        } transition-all duration-300`}
        style={{
          opacity: isExpanded || isFullSize ? 1 : 0,
          transform: isFullSize 
            ? 'translate(-50%, -50%)' 
            : isExpanded 
              ? 'translateY(0)' 
              : 'translateY(20px)',
          top: isFullSize ? '50%' : 'auto',
          left: isFullSize ? '50%' : 'auto',
          bottom: isFullSize ? 'auto' : '24px',
          right: isFullSize ? 'auto' : '24px',
          animation: isExpanded || isFullSize 
            ? 'fadeIn 0.3s ease-out forwards' 
            : 'none',
          transformOrigin: 'bottom right'
        }}
      >
      {/* Header */}
      <div 
        className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center cursor-pointer"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <h3 className="font-semibold text-lg">Chat Support</h3>
        <div className="flex space-x-2">
          <button 
            className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullSize();
            }}
            aria-label={isFullSize ? 'Exit full screen' : 'Expand to full screen'}
          >
            {isFullSize ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
          <button 
            className="w-6 h-6 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (isMinimized) {
                handleRestore();
              } else {
                setIsMinimized(true);
                setIsExpanded(false);
                setIsFullSize(false);
              }
            }}
            aria-label={isMinimized ? 'Restore chat' : 'Minimize to icon'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMinimized ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Welcome message when minimized */}
      {!isExpanded && (
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-gray-600 text-sm">Click to chat with us!</p>
        </div>
      )}

      {/* Chat content */}
      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-indigo-100 text-gray-800 rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Fluxa AI Assistant
            </p>
          </div>
        </>
      )}
    </div>
    </>
  );
};

// Add these styles to your global CSS
const chatboxStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes bounceIn {
    0% { 
      opacity: 0;
      transform: scale(0.5) translateY(20px);
    }
    70% { 
      transform: scale(1.1) translateY(-5px);
    }
    100% { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .chatbox-expanded {
    animation: slideUp 0.3s ease-out forwards;
  }

  .chatbox-collapsed {
    animation: slideDown 0.3s ease-out forwards;
  }

  @keyframes slideDown {
    from { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to { 
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
  }
`;

// Add styles to the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = chatboxStyles;
  document.head.appendChild(styleElement);
}

export default Chatbox;
