import { useMemo, useState } from 'react';

export function useSearch<T extends object>(
    items: T[],
    searchKeys: (keyof T)[],
    initialShowInactive: boolean = false
) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showInactive, setShowInactive] = useState(initialShowInactive);

    // Use useMemo instead of useState + useEffect to avoid potential infinite loops
    const filteredItems = useMemo(() => {
        // First, filter by active status
        let filtered = [...items];
        if (!showInactive && items.length > 0 && 'fl_ativo' in (items[0] || {})) {
            filtered = filtered.filter(item =>
                'fl_ativo' in item ? (item as any).fl_ativo : true
            );
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

        return filtered;
    }, [items, searchTerm, showInactive, searchKeys]);

    return {
        searchTerm,
        setSearchTerm,
        showInactive,
        setShowInactive,
        filteredItems
    };
}
