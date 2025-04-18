// src/resources/FilterBar.jsx
import React from 'react';

function FilterBar({ filter, setFilter }) {
  // These are your filter options. You can add more or change them as needed.
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'My Resources', value: 'my' },
    { label: 'Global Resources', value: 'global' },
    { label: 'Math', value: 'math' },
    { label: 'Mentor Resources', value: 'mentor' },
    { label: 'Mentee Resources', value: 'mentee' },
    { label: 'Videos', value: 'videos' },
  ];

  return (
    <div className="w-48 border-r p-4">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      <div className="flex flex-col space-y-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`
              px-3 py-2 rounded text-left 
              ${filter === opt.value 
                ? 'bg-secondary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
