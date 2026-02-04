import axios from "axios";

const API_URL = "http://localhost:8080/api/transactions";

// 1. Get all
export const getTransactions = () => axios.get(API_URL);

// 2. Add (Matches your TransactionRequestDTO)
export const addTransaction = (data) => axios.post(API_URL, data);

// 3. Filter (Matches your @Override filterByDate)
export const getFilteredTransactions = (start, end) => 
  axios.get(`${API_URL}/filter`, { params: { start, end } });

// 4. Summaries (Matches your getSummary(String type) logic)
export const getIncomeSummary = () => 
  axios.get(`${API_URL}/summary`, { params: { type: 'INCOME' } });

export const getExpenseSummary = () => 
  axios.get(`${API_URL}/summary`, { params: { type: 'EXPENSE' } });

// 5. Delete
export const deleteTransaction = (id) => axios.delete(`${API_URL}/${id}`);

// Ensure this matches your @PutMapping("/{id}")
export const updateTransaction = (id, data) => axios.put(`${API_URL}/${id}`, data);