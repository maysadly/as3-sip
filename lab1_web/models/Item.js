class Item {
    static validate(item) {
        const errors = [];
        if (!item.name || item.name.length < 3) {
            errors.push('Name must be at least 3 characters long');
        }
        if (!item.description || item.description.length < 10) {
            errors.push('Description must be at least 10 characters long');
        }
        if (!item.category || !['electronics', 'books', 'clothing', 'other'].includes(item.category)) {
            errors.push('Invalid category');
        }
        return errors;
    }

    static create(data) {
        return {
            id: Date.now(),
            name: data.name,
            description: data.description,
            category: data.category,
            price: parseFloat(data.price),
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    
    static search(query, filters = {}) {
        let results = [...items];
        
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filters.category) {
            results = results.filter(item => item.category === filters.category);
        }
        
        if (filters.minPrice) {
            results = results.filter(item => item.price >= filters.minPrice);
        }
        
        if (filters.maxPrice) {
            results = results.filter(item => item.price <= filters.maxPrice);
        }
        
        return results;
    }
    
}


class ItemValidator {
    static validatePrice(price) {
        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return 'Price must be a positive number';
        }
        return null;
    }

    static validateCategory(category) {
        const validCategories = ['electronics', 'books', 'clothing', 'other'];
        if (!validCategories.includes(category)) {
            return 'Invalid category selected';
        }
        return null;
    }
}


module.exports = { Item, ItemValidator };
