import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Location {
  lat: number;
  lon: number;
  display_name: string;
}

interface LocationSearchInputProps {
  onLocationSelect: (location: Location) => void;
  placeholder: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ onLocationSelect, placeholder }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (location: Location) => {
    setQuery(location.display_name);
    onLocationSelect(location);
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      {isFocused && suggestions.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.lat + suggestion.lon}
              onMouseDown={() => handleSelect(suggestion)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {suggestion.display_name}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default LocationSearchInput;
