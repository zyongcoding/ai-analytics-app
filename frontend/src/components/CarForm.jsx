import React, { useState } from 'react';

export default function CarForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    brand: 'Toyota',
    model: 'Corolla',
    year: 2018,
    mileage: 60000,
    asking_price: 15000
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numerical inputs to numbers, leave strings as strings
    const parsedValue = ['year', 'mileage', 'asking_price'].includes(name) ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input 
          type="text" name="brand" value={formData.brand} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input 
          type="text" name="model" value={formData.model} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input 
            type="number" name="year" value={formData.year} onChange={handleChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mileage</label>
          <input 
            type="number" name="mileage" value={formData.mileage} onChange={handleChange} required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Asking Price ($)</label>
        <input 
          type="number" name="asking_price" value={formData.asking_price} onChange={handleChange} required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 mt-6"
      >
        {isLoading ? 'Analyzing Market...' : 'Get Valuation'}
      </button>
    </form>
  );
}