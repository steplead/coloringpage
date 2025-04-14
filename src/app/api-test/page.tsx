'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function testApi() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-gemini');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Gemini API Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Gemini API'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">API Response:</h2>
          <div className="p-4 bg-gray-100 rounded">
            <div className="mb-2">
              <span className="font-bold">Success:</span> {result.success ? 'Yes' : 'No'}
            </div>
            
            {result.success ? (
              <div>
                <div className="mb-2">
                  <span className="font-bold">Generated Text:</span> {result.text}
                </div>
                <div className="mb-2">
                  <span className="font-bold">API Key Configured:</span> {result.apiKeyConfigured ? 'Yes' : 'No'}
                </div>
                <div className="mb-2">
                  <span className="font-bold">API URL Configured:</span> {result.apiUrlConfigured ? 'Yes' : 'No'}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <span className="font-bold">Error:</span> {result.error}
                </div>
                {result.details && (
                  <div className="mb-2">
                    <span className="font-bold">Details:</span> {result.details}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">API Configuration:</h2>
        <div className="p-4 bg-gray-100 rounded">
          <p className="mb-2">
            <span className="font-bold">Environment Variables:</span>
          </p>
          <ul className="list-disc pl-8">
            <li>GEMINI_API_KEY: {process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'Set (public)' : 'Not set as public'}</li>
            <li>Server-side environment variables are not visible here</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Note: For security, API keys should only be exposed on the server side, not in client-side code.
          </p>
        </div>
      </div>
    </div>
  );
} 