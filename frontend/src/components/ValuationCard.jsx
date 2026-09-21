import React from 'react';

export default function ValuationCard({ estimatedPrice, dealRating, askingPrice }) {
  const ratingStyles = {
    'Great': 'bg-green-50 text-green-700 border-green-200',
    'Fair': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Overpriced': 'bg-red-50 text-red-700 border-red-200',
  };

  const currentStyle = ratingStyles[dealRating] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Market Valuation
        </h2>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-extrabold text-gray-900">
              ${estimatedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Asking Price: ${askingPrice.toLocaleString()}
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${currentStyle}`}>
            <span className="font-bold text-lg">{dealRating} Deal</span>
          </div>
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-100">
        <div 
          className={`h-full ${dealRating === 'Great' ? 'bg-green-500' : dealRating === 'Fair' ? 'bg-yellow-400' : 'bg-red-500'}`} 
          style={{ width: dealRating === 'Great' ? '85%' : dealRating === 'Fair' ? '50%' : '15%' }}
        />
      </div>
    </div>
  );
}