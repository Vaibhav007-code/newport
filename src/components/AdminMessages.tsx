import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
        // Count unread messages
        const unread = data.filter((msg: Message) => !msg.read).length;
        setUnreadCount(unread);
        // Show notification for unread messages
        if (unread > 0) {
          toast.success(`You have ${unread} unread message${unread > 1 ? 's' : ''}!`);
        }
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
    // Set up polling for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center text-white">Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        {unreadCount > 0 && (
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full animate-pulse">
            {unreadCount} new message{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {messages.length === 0 ? (
        <p className="text-white">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 rounded-lg shadow-lg ${
                message.read ? 'bg-gray-100' : 'bg-white border-l-4 border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{message.name}</h3>
                  <a href={`mailto:${message.email}`} className="text-blue-600 hover:text-blue-800">
                    {message.email}
                  </a>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
              <p className="mt-3 text-gray-800 whitespace-pre-wrap">{message.message}</p>
              {!message.read && (
                <button
                  onClick={() => markAsRead(message.id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
