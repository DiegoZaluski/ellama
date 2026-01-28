import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from './arts';

interface SearchBarProps {
  onSearchChange: (query: string, isSearching: boolean) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  placeholder = 'Search...',
  className = '',
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(query, !!query.trim());
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onSearchChange]);

  return (
    <div
      className={`
      ${className} 
      relative
      shadow-2xl
      bg-bla`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`
          px-4 
          py-2
          focus:outline-none
          rounded-xl
          border-b-2
          text-white
          w-50
          h-12
          placeholder-white
          ${COLORS.border1}
          ${COLORS.bg1}
          `}
      />
      <Search
        stroke="white"
        className={`
          absolute 
          top-1/2 
          right-4 transform 
          -translate-y-1/2`}
      />
    </div>
  );
};

export default SearchBar;
