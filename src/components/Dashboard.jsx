import { useState, useEffect, useMemo } from "react";
import { getTransactions, getFilteredTransactions } from "../services/transactionService";
import SummaryCards from "./SummaryCards";
import ExpenseChart from "./ExpenseChart";
import TransactionList from "./TransactionList";
import TransactionModal from "./TransactionModal";
import ThemeToggle from "./ThemeToggle";
import { FaExchangeAlt } from "react-icons/fa"; // Added for Transfer visibility

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filters
  const [catFilter, setCatFilter] = useState("All");
  const [divFilter, setDivFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // NEW: Dashboard View State (Requirement: Weekly, Monthly, Yearly)
  const [timeframe, setTimeframe] = useState("MONTHLY");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = (dateFrom && dateTo)
          ? await getFilteredTransactions(dateFrom, dateTo)
          : await getTransactions();

        if (isMounted) {
          setTransactions(res?.data ?? []);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; }; 
  }, [refreshKey, dateFrom, dateTo]);

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const matchDiv = divFilter === "All" || t.division === divFilter;
      const matchCat = catFilter === "All" || t.category === catFilter;
      return matchDiv && matchCat;
    });
  }, [transactions, divFilter, catFilter]);

  // Derived Totals
  const income = useMemo(() =>
    transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + Number(t.amount || 0), 0)
  , [transactions]);

  const expense = useMemo(() =>
    transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + Number(t.amount || 0), 0)
  , [transactions]);

  // NEW: Logical grouping for the Chart based on Timeframe Selection
  const chartData = useMemo(() => {
    const summary = {};
    
    filteredData.forEach(t => {
      const date = new Date(t.createdAt);
      let label = "";

      if (timeframe === "WEEKLY") {
        label = `Day ${date.getDate()}`; // Simplistic day grouping
      } else if (timeframe === "YEARLY") {
        label = date.toLocaleString('default', { month: 'short' });
      } else {
        // MONTHLY (Default) - Group by category as per your original design
        if (t.type === "EXPENSE") {
          summary[t.category] = (summary[t.category] || 0) + Number(t.amount);
        }
        return;
      }

      // For Weekly/Yearly, show Income vs Expense trends
      const key = `${label} (${t.type})`;
      summary[key] = (summary[key] || 0) + Number(t.amount);
    });

    return Object.keys(summary).map(key => ({ 
      category: key, 
      amount: summary[key] 
    }));
  }, [filteredData, timeframe]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#f8fafc] dark:bg-[#0b0f1a] text-slate-900 dark:text-slate-100 pb-20">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-white/5 bg-white/70 dark:bg-[#0b0f1a]/70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MoneyManager</h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest opacity-80">Intelligence Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            <button
              onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
            >
              + NEW ENTRY
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-10 mt-10 px-6">
        {loading ? (
          <div className="h-40 flex items-center justify-center font-bold animate-pulse text-indigo-500">OPTIMIZING DATA...</div>
        ) : (
          <>
            <SummaryCards income={income} expense={expense} balance={income - expense} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-[#131722] p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Spending Dynamics</h3>
                    {/* NEW: Timeframe Selector (Requirement) */}
                    <select 
                      value={timeframe} 
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="mt-2 bg-transparent text-[10px] font-black text-indigo-500 uppercase tracking-tighter outline-none cursor-pointer"
                    >
                      <option value="WEEKLY">Weekly View</option>
                      <option value="MONTHLY">Monthly View</option>
                      <option value="YEARLY">Yearly View</option>
                    </select>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
                <div className="h-80">
                  <ExpenseChart data={chartData} />
                </div>
              </div>

              <div className="bg-white dark:bg-[#131722] p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Asset Allocation</h3>
                <div className="space-y-6">
                  {chartData.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-10">No analytical data for current timeframe.</p>
                  ) : (
                    chartData.slice(0, 6).map(item => (
                      <div key={item.category} className="group">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors uppercase">{item.category}</span>
                          <span>₹{item.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min((item.amount / (income + expense || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-bold tracking-tight">History</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
                </div>
              </div>

              {/* Filter Suite */}
              <div className="bg-white dark:bg-[#131722] p-6 rounded-3xl flex flex-wrap gap-5 items-end border border-slate-200/50 dark:border-white/5 shadow-sm">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Division</label>
                  <select 
                    value={divFilter} 
                    onChange={(e) => setDivFilter(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-[#1c212c] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    <option value="All">All Divisions</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="OFFICE">Office</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[140px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Category</label>
                  <select 
                    value={catFilter} 
                    onChange={(e) => setCatFilter(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-[#1c212c] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="FOOD">Food</option>
                    <option value="FUEL">Fuel</option>
                    <option value="MOVIE">Movie</option>
                    <option value="MEDICAL">Medical</option>
                    <option value="LOAN">Loan</option>
                    <option value="SALARY">Salary</option>
                    <option value="TRANSFER">Transfer</option> {/* Added for transfers */}
                  </select>
                </div>

                <div className="flex-[2] min-w-[300px] flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">From</label>
                    <input 
                      type="date" 
                      value={dateFrom} 
                      onChange={(e) => setDateFrom(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-[#1c212c] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-bold outline-none" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">To</label>
                    <input 
                      type="date" 
                      value={dateTo} 
                      onChange={(e) => setDateTo(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-[#1c212c] border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs font-bold outline-none" 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => { setDivFilter("All"); setCatFilter("All"); setDateFrom(""); setDateTo(""); setTimeframe("MONTHLY"); }}
                  className="p-3 text-slate-400 hover:text-rose-500 transition-colors bg-slate-100 dark:bg-white/5 rounded-xl"
                  title="Reset Filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              <div className="bg-white dark:bg-[#131722] rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/5">
                <TransactionList 
                  transactions={filteredData} 
                  setRefreshKey={setRefreshKey} 
                  onEdit={handleEdit} 
                />
              </div>
            </section>
          </>
        )}
      </main>

      {isModalOpen && (
        <TransactionModal
          editData={editingTransaction}
          onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
          onSuccess={() => { setIsModalOpen(false); setEditingTransaction(null); setRefreshKey(k => k + 1); }}
        />
      )}
    </div>
  );
};

export default Dashboard;