import { useState, useEffect } from 'react'

// Simple test App to diagnose the white screen issue
function App() {
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    console.log('App component mounted successfully');
    setIsWorking(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          PMB Sri Lanka - Diagnostic Mode
        </h1>
        <p className="text-gray-700 mb-4">
          {isWorking ? '✅ React is working correctly!' : '⏳ Loading...'}
        </p>
        <div className="bg-emerald-100 p-4 rounded border-l-4 border-emerald-500">
          <p className="text-emerald-800 font-semibold">
            If you can see this message, React is rendering successfully.
          </p>
          <p className="text-emerald-700 text-sm mt-2">
            The white screen was likely caused by the empty Features.jsx component.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}

export default App
