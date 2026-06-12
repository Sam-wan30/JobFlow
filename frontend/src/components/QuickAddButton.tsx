import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const QuickAddButton: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate('/jobs');
    setTimeout(() => {
      const addButton = document.querySelector('button[class*="bg-slate-900"]') as HTMLButtonElement;
      addButton?.click();
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 hover:shadow-xl hover:scale-110 transition-all duration-200 cursor-pointer group"
      aria-label="Quick add application"
      title="Add Application"
    >
      <Plus className={`h-6 w-6 transition-transform duration-200 ${isHovered ? 'rotate-90' : ''}`} />
      
      {/* Tooltip */}
      <div className="absolute right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          Add Application
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      </div>
    </button>
  );
};

export default QuickAddButton;
