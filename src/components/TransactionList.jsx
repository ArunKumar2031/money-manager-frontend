import { useState } from "react"; 
import { FaEdit, FaTrash, FaLock, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { deleteTransaction } from "../services/transactionService";
import toast from 'react-hot-toast';

const TransactionList = ({ transactions, setRefreshKey, onEdit }) => {
  const [deletingId, setDeletingId] = useState(null);

  const isEditable = (createdAt) => {
    if (!createdAt) return false;
    const diffInHours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    return diffInHours <= 12;
  };

  const confirmDelete = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success("Record deleted successfully");
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error("Deletion failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3 p-2">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
           <div className="w-12 h-12 mb-4 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center">?</div>
           <p className="text-xs font-black uppercase tracking-[0.3em]">No Transactions Found</p>
        </div>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id || tx._id} className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#121418] border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tx.type === "INCOME" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                {tx.type === "INCOME" ? <FaArrowUp size={14} /> : <FaArrowDown size={14} />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-sm uppercase text-slate-900 dark:text-white">{tx.category}</h4>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 font-black uppercase tracking-tighter">{tx.division}</span>
                </div>
                <p className="text-[10px] text-slate-500 italic line-clamp-1">{tx.description || "No description"}</p>
                <p className="text-[8px] text-slate-400 mt-1.5 font-mono">{new Date(tx.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className={`font-mono font-black text-sm text-right min-w-[80px] ${tx.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {tx.type === "INCOME" ? "+" : "-"} ₹{Number(tx.amount).toLocaleString()}
              </span>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                {isEditable(tx.createdAt) ? (
                  <button onClick={() => onEdit(tx)} className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-lg"><FaEdit size={14} /></button>
                ) : (
                  <div className="group/lock relative p-2 text-slate-300 dark:text-slate-700 cursor-help">
                    <FaLock size={12} />
                    {/* FIXED TOOLTIP POSITIONING BELOW */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase rounded-lg opacity-0 group-hover/lock:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl z-50">
                      Locked: Edits only allowed within 12hour
                      {/* Triangle pointer moved to the right to match the box */}
                      <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-900 dark:border-t-white"></div>
                    </div>
                  </div>
                )}
                
                {deletingId === (tx.id || tx._id) ? (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                    <button onClick={() => confirmDelete(tx.id || tx._id)} className="text-[9px] font-black text-rose-500 uppercase hover:underline">Confirm</button>
                    <button onClick={() => setDeletingId(null)} className="text-[9px] font-black text-slate-500 uppercase">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeletingId(tx.id || tx._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <FaTrash size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;