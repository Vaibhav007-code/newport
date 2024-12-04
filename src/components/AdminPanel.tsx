import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Messages</h1>
      <div className="grid gap-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{message.name}</h3>
              <span className="text-sm text-gray-500">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{message.email}</p>
            <p className="text-gray-800">{message.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
