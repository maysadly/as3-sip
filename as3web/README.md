# User Management System

A full-stack web application for managing user data with MongoDB integration, featuring CRUD operations, search functionality, pagination, and data visualization.

## Features

- **MongoDB Integration**: Complete CRUD operations for user management
- **Search Functionality**: Real-time search across user records
- **Data Filtering/Sorting**: Sort users by name, age, or occupation
- **Pagination**: Efficient handling of large datasets
- **Data Visualization**: Interactive charts showing age and occupation distribution
- **Responsive Design**: Mobile-friendly user interface
- **Error Handling**: Comprehensive error management and user feedback

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB:
```bash
# For Windows
"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe"

# For macOS/Linux
mongod
```

4. Run the application:
```bash
node server.js
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage Instructions

### Adding a New User
1. Fill out the user form with name, email, age, and occupation
2. Click "Submit" to add the user

### Viewing Users
- Users are displayed in a table format
- Use the search bar to filter users
- Click column headers to sort by different fields
- Use pagination controls to navigate through users

### Editing a User
1. Click the "Edit" button next to a user
2. The form will be populated with user data
3. Modify the desired fields
4. Click "Submit" to save changes

### Deleting a User
1. Click the "Delete" button next to a user
2. Confirm the deletion in the popup dialog

### Using Additional Features
- **Search**: Type in the search bar to filter users in real-time
- **Sorting**: Use the sort dropdown to order users by different fields
- **Analytics**: View age and occupation distribution charts at the bottom of the page

## Verification Steps

1. **Database Connection**:
   - Check the console for "Connected to MongoDB successfully" message
   - Verify no connection errors are displayed

2. **CRUD Operations**:
   - Add a new user and verify it appears in the table
   - Edit an existing user and confirm changes are saved
   - Delete a user and verify they're removed from the table
   - Search for specific users and confirm results

3. **Additional Features**:
   - Test pagination by adding more than 10 users
   - Verify search functionality works across all fields
   - Confirm sorting works in both ascending and descending order
   - Check that analytics charts update when data changes

## Troubleshooting

- If MongoDB fails to connect, ensure the MongoDB service is running
- Clear browser cache if the UI appears outdated
- Check browser console for any JavaScript errors
- Verify all form fields are filled when adding/editing users

## Technologies Used

- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: HTML5, Tailwind CSS, JavaScript
- Charts: Chart.js
- Database: MongoDB

## Screenshots

[Include screenshots of the application showing:
1. Main interface with user table
2. Add/Edit user form
3. Search and sorting functionality
4. Analytics charts]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request