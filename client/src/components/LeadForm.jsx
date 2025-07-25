import { useState } from 'react';
import axios from 'axios';

export default function LeadForm({ onResponse }) {
  const [conversation, setConversation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post("http://localhost:7000/api/ai-agent/parse-and-create", { conversation });

      onResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      onResponse('');
      setError(err.response?.data?.error || "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full border p-2"
        rows="6"
        value={conversation}
        onChange={(e) => setConversation(e.target.value)}
        placeholder="Paste conversation here..."
      />
      {error && <p className="text-red-500">{error}</p>}
      <button disabled={isLoading} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
        {isLoading ? "Processing..." : "Submit"}
      </button>
    </form>
  );
}
