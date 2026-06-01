# Money Tracker Application

A full-featured money tracker web application with React frontend and Flask backend.

## Features

- ✅ **Transaction Management**: Add, edit, and delete income and expense transactions
- ✅ **Category Management**: Organize transactions by categories
- ✅ **Budget Tracking**: Set monthly budgets and track spending against them
- ✅ **Analytics**: View spending patterns with interactive charts
- ✅ **Monthly Trends**: Visualize income and expense trends over time
- ✅ **Real-time Updates**: Instant updates across all views

## Tech Stack

### Frontend
- React 18
- Chart.js for analytics
- Axios for API requests
- CSS3 with responsive design

### Backend
- Python Flask
- SQLAlchemy ORM
- SQLite Database
- Flask-CORS for cross-origin requests

## Project Structure

```
Money-Tracker/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── backend/                  # Flask application
    ├── app.py               # Flask application entry point
    ├── models.py            # Database models
    ├── routes/
    │   └── api.py          # API endpoints
    └── requirements.txt     # Python dependencies
```

## Installation & Setup

### Prerequisites
- Node.js and npm
- Python 3.8+
- Git

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Start Backend Server
```bash
cd backend
python app.py
```
Backend will run on `http://localhost:5000`

### Terminal 2 - Start Frontend Server
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/<id>` - Delete a category

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/<id>` - Get a specific transaction
- `PUT /api/transactions/<id>` - Update a transaction
- `DELETE /api/transactions/<id>` - Delete a transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `DELETE /api/budgets/<id>` - Delete a budget

## Database

The application uses SQLite with three main tables:
- **categories**: Transaction categories
- **transactions**: Income and expense records
- **budgets**: Monthly budget limits per category

Database file: `backend/money_tracker.db`

## Usage

1. **Create Categories**: Navigate to the Categories tab and add transaction categories
2. **Add Transactions**: Use the Transactions tab to log your income and expenses
3. **Set Budgets**: Go to Budgets tab to set monthly spending limits
4. **View Analytics**: Check the Analytics tab for visual reports and insights

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## License

MIT License - feel free to use this project as you wish.
