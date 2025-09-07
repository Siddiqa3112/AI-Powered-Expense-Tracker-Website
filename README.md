# AI-Powered Expense Tracker

## Overview
This AI-Powered Expense Tracker is a web application that helps users manage their finances by tracking daily expenses, automatically categorizing them using AI, and providing insightful analytics about spending habits.

## Features

### Expense Logging System
- Add expenses with amount, description, date, and optional category
- Upload receipts for automatic processing
- Edit or delete existing expenses
- Search and filter expenses by category

### AI Categorization
- Automatic categorization of expenses based on description
- Receipt image processing for data extraction
- Smart categorization even when category is not specified

### Analytics & Insights
- Visual breakdown of expenses by category (doughnut chart)
- Monthly spending trends over time (line chart)
- Summary cards showing total expenses, monthly expenses, and top spending category

### AI-Powered Insights
- Personalized spending insights based on your expense patterns
- Unusual expense detection
- Spending pattern analysis
- Savings opportunities identification

### Data Persistence
- Local storage for saving expense data
- No account required, data stays on your device

## Technologies Used
- HTML5, CSS3, and JavaScript (ES6+)
- Chart.js for data visualization
- Font Awesome for icons
- Local Storage API for data persistence
- Simulated AI categorization (can be connected to real AI services)

## How to Use

1. **Add an Expense**:
   - Fill out the expense form with amount, description, and date
   - Optionally select a category or let AI categorize it for you
   - Optionally upload a receipt image
   - Click "Add Expense"

2. **View Your Expenses**:
   - All expenses are listed in the "Recent Expenses" section
   - Use the search box to find specific expenses
   - Filter expenses by category using the dropdown

3. **Analyze Your Spending**:
   - View the summary cards for quick insights
   - Explore the category breakdown chart
   - Track your spending trends over time

4. **Get AI Insights**:
   - Add at least 3 expenses to receive AI-powered insights
   - Review personalized recommendations and observations

## Future Enhancements
- User authentication system
- Cloud synchronization
- Budget setting and tracking
- Export functionality (CSV, PDF)
- Advanced AI categorization using machine learning
- Mobile application

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start tracking your expenses!

## Note on AI Features

The current implementation uses simulated AI categorization for demonstration purposes. In a production environment, this would be connected to actual AI services like:
- OpenAI's GPT for text analysis
- Google Cloud Vision or Tesseract OCR for receipt processing
- Custom trained models for expense categorization

## License
This project is open source and available under the MIT License.