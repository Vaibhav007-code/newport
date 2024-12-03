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

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
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
        toast.success('Message marked as read');
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to update message');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="text-center">Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border ${
                message.read ? 'bg-gray-50' : 'bg-white border-indigo-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{message.name}</h3>
                  <p className="text-sm text-gray-600">{message.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
              <p className="mt-2">{message.message}</p>
              {!message.read && (
                <button
                  onClick={() => markAsRead(message.id)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
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
