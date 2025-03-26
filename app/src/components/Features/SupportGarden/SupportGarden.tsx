import { useState } from 'react';
import { Search } from '../../../hooks/Search';
import { ExperientialCategory } from './ExperientialCategory';
import { ContentFilter } from './ContentFilter';
import { Post } from './Post';

export const SupportGarden = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [categories, setCategory] = useState<string>([]);

    return (
        <div>
            <Search setSearchTerm={ setSearchTerm } />
        </div>
    )
}