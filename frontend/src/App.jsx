import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('valuation');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('valuation')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'valuation' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                AI Valuation Tool
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'analytics' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Market Analytics (Tableau)
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {activeTab === 'valuation' ? <Dashboard /> : <AnalyticsDashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;