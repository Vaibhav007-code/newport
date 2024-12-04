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
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages');
      }
      
      setMessages(data);
      console.log('Messages fetched:', data); // Debug log
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Auto-refresh messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel - Messages</h1>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No messages yet</div>
        ) : (
          messages.map((message) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
