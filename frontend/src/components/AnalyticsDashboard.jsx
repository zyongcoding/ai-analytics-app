import React from 'react';

export default function AnalyticsDashboard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[800px] flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Market Trends Dashboard</h2>
          <p className="text-sm text-gray-500">Live Tableau analytics based on historical vehicle data.</p>
        </div>
      </div>
      
      {/* Tableau Embed Frame */}
      <div className="flex-grow w-full bg-gray-100">
        <iframe 
          title="Used Car Market Analytics" 
          className="w-full h-full border-0"
          src="https://public.tableau.com/views/UsedCarMarketAnalytics/Dashboard1?:showVizHome=no&:embed=true" 
          allowFullScreen={true}
        ></iframe>
      </div>
    </div>
  );
}