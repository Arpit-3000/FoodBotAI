export default function ChatBox({ response }) {
    if (!response) return null;
    return (
      <div className="mt-4 p-4 bg-gray-100 border rounded">
        <h3 className="font-bold">Response:</h3>
        <pre>{response}</pre>
      </div>
    );
  }
  