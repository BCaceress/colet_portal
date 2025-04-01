import { useEffect, useState } from 'react';

export function useSearch<T>(
    items: T[],
    searchKeys: (keyof T)[],
    initialShowInactive: boolean = false
) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showInactive, setShowInactive] = useState(initialShowInactive);
    const [filteredItems, setFilteredItems] = useState<T[]>(items);

    useEffect(() => {
        // First, filter by active status
        let filtered = [...items];
        if (!showInactive && 'fl_ativo' in items[0]) {
            // @ts-ignore: fl_ativo might not be in T
            filtered = filtered.filter(item => item.fl_ativo);
        }

        // Then, apply search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(item => {
                return searchKeys.some(key => {
                    const value = item[key];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    return false;
                });
            });
        }

        setFilteredItems(filtered);
    }, [items, searchTerm, showInactive, searchKeys]);

    return {
        searchTerm,
        setSearchTerm,
        showInactive,
        setShowInactive,
        filteredItems
    };
}
