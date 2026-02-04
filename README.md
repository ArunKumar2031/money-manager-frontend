# 💰 Money Manager - Financial Intelligence Hub

Money Manager is a sophisticated personal and business financial tracking application. It allows users to record transactions, manage assets across different accounts, and visualize spending habits through dynamic time-series analytics.

---

## 🚀 Key Features

- **Triple-Entry Tracking**: Seamlessly manage **Income**, **Expenses**, and **Account Transfers**.
- **Dynamic Analytics**: Toggle between **Weekly**, **Monthly**, and **Yearly** spending reports.
- **Asset Management**: Track liquidity across multiple accounts (Bank, Cash, Savings).
- **Smart Logic**: 
  - **12-Hour Grace Period**: Edits and deletions are only permitted within 12 hours of record creation.
  - **Categorization**: Automatic grouping by category (Food, Fuel, Medical, etc.).
  - **Divisions**: Separate "Office" and "Personal" finances with a single click.
- **Advanced Filtering**: Filter history by Date Range, Division, or Category.
- **Premium UI/UX**: Fully responsive Dark/Light mode interface built with Tailwind CSS and Framer Motion.

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Fa)
- **Animations**: Framer Motion
- **State Management**: React Hooks (useState, useMemo, useEffect)
- **Notifications**: React Hot Toast
- **Backend (Required)**: Spring Boot 
- **Database**: MongoDB Atlas

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── Dashboard.jsx        # Main Hub & Timeframe Logic
│   ├── SummaryCards.jsx     # Financial Overview (Liquidity/Inflow/Outflow)
│   ├── ExpenseChart.jsx     # Visual Analytics (Weekly/Monthly/Yearly)
│   ├── TransactionList.jsx  # History & 12h Lock Logic
│   ├── TransactionModal.jsx # Entry Form (Income/Expense/Transfer)
│   └── ThemeToggle.jsx      # Dark Mode Switcher
├── services/
│   └── transactionService.js # API Communication Layer
└── App.js                   # Application Entry Point
