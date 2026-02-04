import { useState, useEffect } from "react";
import { FaTimes, FaUndo, FaExchangeAlt } from "react-icons/fa";
import toast from 'react-hot-toast';
import { addTransaction, updateTransaction } from "../services/transactionService";

const TransactionModal = ({ onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    type: "EXPENSE",
    category: "FOOD",
    amount: "",
    division: "PERSONAL",
    description: "",
    fromAccount: "BANK", // Added for Account Tracking
    toAccount: "CASH",   // Added for Account Tracking
    createdAt: new Date().toISOString().split('T')[0]
  });

  const incomeCategories = ["SALARY", "RENT", "DIVIDEND", "INVESTMENT", "OTHER"];
  const expenseCategories = ["FOOD", "FUEL", "MOVIE", "MEDICAL", "LOAN", "OTHER"];
  const accounts = ["BANK", "CASH", "SAVINGS", "CREDIT CARD"];

  const currentCategories = formData.type === "INCOME" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        createdAt: new Date(editData.createdAt).toISOString().split('T')[0]
      });
    }
  }, [editData]);

  const handleTypeChange = (newType) => {
    let defaultCategory = "FOOD";
    if (newType === "INCOME") defaultCategory = "SALARY";
    if (newType === "TRANSFER") defaultCategory = "TRANSFER";
    
    setFormData({ ...formData, type: newType, category: defaultCategory });
  };

  const resetForm = () => {
    setFormData({
      type: "EXPENSE",
      category: "FOOD",
      amount: "",
      division: "PERSONAL",
      description: "",
      fromAccount: "BANK",
      toAccount: "CASH",
      createdAt: new Date().toISOString().split('T')[0]
    });
    toast.success("Form cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await updateTransaction(editData.id || editData._id, formData);
        toast.success("Record updated!");
      } else {
        await addTransaction(formData);
        toast.success(`${formData.type} recorded!`);
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data || "Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-500 dark:text-slate-400">
              {editData ? "Modify Record" : "New Entry"}
            </h2>
            {!editData && (
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-indigo-500 transition-colors">
                <FaUndo size={10} />
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Tab Switcher - Now includes TRANSFER */}
        <div className="flex p-3 gap-2 bg-slate-50 dark:bg-black/20">
          {["INCOME", "EXPENSE", "TRANSFER"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTypeChange(tab)}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${
                formData.type === tab
                  ? tab === "INCOME" ? "bg-emerald-500 text-white" 
                  : tab === "TRANSFER" ? "bg-amber-500 text-white"
                  : "bg-indigo-600 text-white"
                  : "text-slate-400 dark:text-slate-500 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Value (INR)</label>
            <input
              required
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-2xl font-black text-indigo-600 dark:text-indigo-400 outline-none focus:ring-2 ring-indigo-500/20 transition-all placeholder:opacity-30"
              placeholder="0.00"
            />
          </div>

          {/* Conditional Rendering: Category & Division vs Accounts */}
          {formData.type === "TRANSFER" ? (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Account</label>
                <select
                  value={formData.fromAccount}
                  onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-indigo-500"
                >
                  {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Account</label>
                <select
                  value={formData.toAccount}
                  onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-indigo-500"
                >
                  {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Division</label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
                >
                  <option value="PERSONAL">PERSONAL</option>
                  <option value="OFFICE">OFFICE</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Date & Time</label>
            <input
              type="date"
              value={formData.createdAt}
              onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
              className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Notes</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-slate-700 dark:text-white outline-none focus:border-indigo-500"
              placeholder="Brief description..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-2"
          >
            Confirm {formData.type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;