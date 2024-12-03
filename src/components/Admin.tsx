import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setIsAuthorized(true);
        localStorage.setItem('adminSecret', password);
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Failed to authenticate');
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
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
        <div className="space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{message.name}</h3>
                  <a href={`mailto:${message.email}`} className="text-[#2eaadc] hover:underline">
                    {message.email}
                  </a>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
              <div className="mt-4 flex gap-4">
                <a
                  href={`mailto:${message.email}?subject=Re: Portfolio Contact`}
                  className="inline-flex items-center px-4 py-2 bg-[#2eaadc] text-white rounded-lg hover:bg-[#2596c4] transition-colors duration-300"
                >
                  Reply via Email
                </a>
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
