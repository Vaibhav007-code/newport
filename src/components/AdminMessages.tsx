import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import io from 'socket.io-client';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || '', {
      path: '/socket.io/',
    });

    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [message, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.success('New message received!');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        const unread = data.filter((msg: Message) => !msg.read).length;
        setUnreadCount(unread);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/messages/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, read: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Message marked as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Messages ({messages.length})</h2>
        {unreadCount > 0 && (
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
            {unreadCount} unread
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`bg-gray-800 rounded-lg p-6 ${
              !msg.read ? 'border-l-4 border-indigo-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{msg.name}</h3>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {msg.email}
                </a>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm">
                  {format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}
                </span>
                {!msg.read && (
                  <button
                    onClick={() => markAsRead(msg._id)}
                    className="ml-4 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
