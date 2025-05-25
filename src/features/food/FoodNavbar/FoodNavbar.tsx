import { useState } from "react";

interface FoodNavbarProps {
  foodTypes: string[];
  activeType: string;
  setActiveType: (type: string) => void;
}

const FoodNavbar: React.FC<FoodNavbarProps> = ({ foodTypes, activeType, setActiveType }) => {

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
  <button className="ml-auto flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition">
    Filtri
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 018 17V13.414a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z" />
    </svg>
  </button>
</nav>
  );
};

export default FoodNavbar;