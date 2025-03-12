import React, { useState } from 'react';

interface SearchProps {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const Search: React.FC<SearchProps> = ({ setSearchTerm }) => {
    const [searchInput, setSearchInput] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setSearchInput('');
    }

    return (
        <form onSubmit={ handleSubmit }>
            <label htmlFor="searchInput">Enter a Search Term</label>
            <input type="text" id="searchInput" />
            <button type="submit">Search</button>
        </form>
    )
}
