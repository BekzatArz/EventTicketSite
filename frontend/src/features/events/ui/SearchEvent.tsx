// src/components/SearchEvent/SearchEvent.tsx
import React from 'react';

interface SearchEventProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchEvent: React.FC<SearchEventProps> = ({ searchQuery, onSearchChange }) => {
    return (
        <div className="search-event">
            <input
                type="text"
                placeholder="Поиск событий..."
                value={searchQuery}
                onChange={onSearchChange}
            />
        </div>
    );
};

export default SearchEvent;
