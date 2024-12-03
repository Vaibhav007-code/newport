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
      // Connect to WebSocket server
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
      
      newSocket.on('connect', () => {
        console.log('Admin connected to server');
      });

      newSocket.on('new-message', (message: Message) => {
        setMessages(prev => [message, ...prev]);
        toast.info(`New message from ${message.name}`);
      });

      setSocket(newSocket);

      // Fetch existing messages
      fetchMessages();

      return () => {
        newSocket.close();
      };
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
    if (!socket) return;

    socket.emit('admin-reply', { messageId, email });
    window.location.href = `mailto:${email}?subject=Re: Portfolio Contact`;
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
