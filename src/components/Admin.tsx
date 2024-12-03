import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const Admin: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      let reconnectAttempts = 0;
      const maxReconnectAttempts = 5;
      const reconnectDelay = 2000;

      const connectSocket = () => {
        const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
          reconnection: true,
          reconnectionDelay: reconnectDelay,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: maxReconnectAttempts,
        });
        
        newSocket.on('connect', () => {
          console.log('Admin connected to server');
          reconnectAttempts = 0;
          fetchMessages(); // Fetch messages on successful connection
        });

        newSocket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            setTimeout(connectSocket, reconnectDelay);
          } else {
            toast.error('Unable to connect to server. Please try refreshing the page.');
          }
        });

        newSocket.on('new-message', (message: Message) => {
          setMessages(prev => [message, ...prev]);
          // Show notification with message preview
          const preview = message.message.slice(0, 50) + (message.message.length > 50 ? '...' : '');
          toast.info(`New message from ${message.name}: ${preview}`);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      };

      connectSocket();
    }
  }, [isAuthorized]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setIsAuthorized(true);
        localStorage.setItem('adminSecret', password);
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Failed to authenticate');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/read/${messageId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        );
      }
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleReply = async (messageId: string, email: string) => {
    if (!socket?.connected) {
      toast.error('Connection lost. Please refresh the page.');
      return;
    }

    try {
      socket.emit('admin-reply', { messageId, email });
      await markAsRead(messageId);
      window.location.href = `mailto:${email}?subject=Re: Portfolio Contact`;
    } catch (error) {
      toast.error('Failed to process reply. Please try again.');
    }
  };

  useEffect(() => {
    const savedSecret = localStorage.getItem('adminSecret');
    if (savedSecret) {
      setPassword(savedSecret);
      handleLogin(new Event('submit') as any);
    }
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#191919] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a2a2a] p-8 rounded-lg border border-[#333333] w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2eaadc]"
            />
            <button
              type="submit"
              className="w-full bg-[#2eaadc] text-white py-2 rounded-lg hover:bg-[#2596c4] transition-colors duration-300"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191919] py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <button
            onClick={() => {
              localStorage.removeItem('adminSecret');
              setIsAuthorized(false);
              setPassword('');
              if (socket) socket.close();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
        <div className="space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#2a2a2a] p-6 rounded-lg border ${
                message.read ? 'border-[#333333]' : 'border-[#2eaadc]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{message.name}</h3>
                  <a href={`mailto:${message.email}`} className="text-[#2eaadc] hover:underline">
                    {message.email}
                  </a>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleReply(message._id, message.email)}
                  className="inline-flex items-center px-4 py-2 bg-[#2eaadc] text-white rounded-lg hover:bg-[#2596c4] transition-colors duration-300"
                >
                  Reply
                </button>
                {!message.read && (
                  <button
                    onClick={() => markAsRead(message._id)}
                    className="inline-flex items-center px-4 py-2 bg-[#333333] text-white rounded-lg hover:bg-[#444444] transition-colors duration-300"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-gray-400">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
