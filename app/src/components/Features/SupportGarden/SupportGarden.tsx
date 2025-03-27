import { useState } from 'react';
import { Search } from '../../../hooks/Search';
import { ExperientialCategories } from './ExperientialCategories';
import { ContentFilter } from './ContentFilter';
import { Post } from './Post';

export const SupportGarden = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    return (
        <div>
            <h1>Garden of Support</h1>
            <Search setSearchTerm={ setSearchTerm }/>
            <ExperientialCategories/>
        </div>
    )
}