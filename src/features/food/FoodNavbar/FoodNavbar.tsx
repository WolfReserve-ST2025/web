import { useState } from "react";

interface FoodNavbarProps {
  foodTypes: string[];
  activeType: string;
  setActiveType: (type: string) => void;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { label: "Price Low to High", value: "price-asc" },
  { label: "Price High to Low", value: "price-desc" },
];


const FoodNavbar = ({ foodTypes, activeType, setActiveType, onFilterChange }: FoodNavbarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <nav className="flex items-center gap-6 bg-white shadow px-8 py-4 rounded-lg mb-8">
      {foodTypes.map(type => (
        <button
          key={type}
          onClick={() => setActiveType(type)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition
        ${activeType === type ? 'bg-yellow-400 text-black shadow' : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'}`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
        </button>
      ))}
      <div className="ml-auto relative">
        <button
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          Filters
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17V13.414a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z" />
          </svg>
        </button>
        {showFilters && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className="block w-full text-left px-4 py-2 hover:bg-yellow-100"
                onClick={() => {
                  setShowFilters(false);
                  onFilterChange && onFilterChange(filter.value);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default FoodNavbar;