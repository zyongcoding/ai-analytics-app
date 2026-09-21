import React, { useState } from 'react';
import ValuationCard from './ValuationCard';
import CarForm from './CarForm';
import ComparablesGrid from './ComparablesGrid';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // Added error state

  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setErrorMsg(null); // Clear previous errors
    
    try {
      const response = await fetch('https://ai-backend-api-19263.azurewebsites.net/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults({ ...data, asking_price: formData.asking_price });
    } catch (error) {
      console.error("Analysis failed:", error);
      // Display the error on the UI
      setErrorMsg("Failed to connect to the live Azure backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Used Car Intelligence</h1>
        <p className="text-gray-500 mt-1">AI-powered vehicle valuation and market comparables.</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {errorMsg}
              </div>
            )}
            <CarForm onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <>
              <ValuationCard 
                estimatedPrice={results.estimated_price} 
                dealRating={results.deal_rating} 
                askingPrice={results.asking_price}
              />
              <ComparablesGrid cars={results.similar_cars} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 min-h-[400px]">
              <p className="text-gray-400 font-medium">Enter vehicle specs to generate a market report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}