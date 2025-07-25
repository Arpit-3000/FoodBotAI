import { useState } from 'react';
import LeadForm from './components/LeadForm';
import ChatBox from './components/ChatBox';

const App = () => {
  const [response, setResponse] = useState('');

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Talk to our AI Agent</h1>
      <LeadForm onResponse={setResponse} />
      {response && <ChatBox response={response} />}
    </div>
  );
};

export default App;
