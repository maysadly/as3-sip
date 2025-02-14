const Item = require('../models/Item');
const { items } = require('../config/database');

class ItemController {
    // Get all items with optional filtering and sorting
    static index(req, res) {
        let filteredItems = [...items];
        
        // Search functionality
        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        if (req.query.category && req.query.category !== 'all') {
            filteredItems = filteredItems.filter(item => 
                item.category === req.query.category
            );
        }

        // Sorting
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';

        filteredItems.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            }
            return a[sortBy] < b[sortBy] ? 1 : -1;
        });

        res.render('index', { 
            items: filteredItems,
            search: req.query.search,
            category: req.query.category,
            sortBy,
            sortOrder
        });
    }

    static create(req, res) {
        res.render('add');
    }

    static store(req, res) {
        try {
            const errors = Item.validate(req.body);
            if (errors.length > 0) {
                req.flash('error', errors);
                return res.render('add', { 
                    errors, 
                    input: req.body 
                });
            }

            const item = Item.create(req.body);
            items.push(item);
            
            req.flash('success', 'Item created successfully');
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    static edit(req, res) {
        const item = items.find(i => i.id == req.params.id);
        if (!item) {
            req.flash('error', 'Item not found');
            return res.redirect('/');
        }
        res.render('edit', { item });
    }

    static update(req, res) {
        try {
            const errors = Item.validate(req.body);
            if (errors.length > 0) {
                req.flash('error', errors);
                return res.render('edit', { 
                    errors, 
                    item: { ...req.body, id: req.params.id } 
                });
            }

            const item = items.find(i => i.id == req.params.id);
            if (!item) {
                req.flash('error', 'Item not found');
                return res.redirect('/');
            }

            Object.assign(item, {
                ...req.body,
                updatedAt: new Date()
            });

            req.flash('success', 'Item updated successfully');
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }

    static destroy(req, res) {
        const index = items.findIndex(i => i.id == req.params.id);
        if (index === -1) {
            req.flash('error', 'Item not found');
            return res.redirect('/');
        }

        items.splice(index, 1);
        req.flash('success', 'Item deleted successfully');
        res.redirect('/');
    }
}

module.exports = ItemController;
