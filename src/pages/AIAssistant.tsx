import React, { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface AIResponse {
  text: string;
  type: 'idea' | 'summary';
}

function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate response');

      const data = await response.json();
      setResponses(prev => [...prev, data]);
      setPrompt('');
    } catch (error) {
      toast.error('Failed to generate response. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Bot className="h-8 w-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How can I help you?</h2>
        <p className="text-gray-600 mb-4">
          I can help you with:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Generating CSR event ideas</li>
            <li>Creating event summaries</li>
            <li>Suggesting volunteer engagement strategies</li>
            <li>Analyzing impact metrics</li>
          </ul>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4 mb-6">
          {responses.map((response, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Bot className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="text-gray-900 whitespace-pre-wrap">{response.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything about CSR initiatives..."
            className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={4}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 text-green-600 hover:text-green-700 disabled:text-gray-400"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAssistant;