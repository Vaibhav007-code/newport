import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
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

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
      });
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Message marked as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to update message');
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Messages</h2>
        {unreadCount > 0 && (
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full animate-pulse">
            {unreadCount} new message{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No messages yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                message.read ? 'bg-gray-800' : 'bg-gray-900 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl text-white">{message.name}</h3>
                  <a 
                    href={`mailto:${message.email}`} 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="text-sm text-gray-400 mt-2 md:mt-0">
                  {format(new Date(message.created_at), 'PPpp')}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
              </div>

              {!message.read && (
                <div className="mt-6">
                  <button
                    onClick={() => markAsRead(message.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span>Mark as read</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
