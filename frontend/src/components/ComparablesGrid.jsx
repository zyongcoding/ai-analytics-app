import React from 'react';

export default function ComparablesGrid({ cars }) {
  if (!cars || cars.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Comparable Market Vehicles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cars.map((car, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900">{car.year} {car.brand}</h4>
              <span className="font-bold text-blue-600">${car.price.toLocaleString()}</span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Model: {car.model}</p>
              <p>Mileage: {car.mileage.toLocaleString()} miles</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}