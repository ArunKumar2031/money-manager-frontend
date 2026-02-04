import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown, FaWallet, FaChartPie } from "react-icons/fa";

const SummaryCards = ({ income = 0, expense = 0, balance = 0 }) => {
  
  // Calculate spending ratio safely
  const spendRatio = income > 0 ? (expense / income) * 100 : 0;

  const cards = [
    {
      title: "Net Balance",
      amount: balance,
      icon: <FaWallet />,
      color: "from-indigo-600 to-indigo-900",
      accent: "bg-white/20",
      isMain: true,
      subtitle: "Available across all accounts"
    },
    {
      title: "Total Income",
      amount: income,
      icon: <FaArrowUp />,
      color: "from-[#121418] to-[#121418]",
      accent: "text-emerald-500 bg-emerald-500/10",
      border: "border-emerald-500/20",
      subtitle: "Total Revenue"
    },
    {
      title: "Total Outcome",
      amount: expense,
      icon: <FaArrowDown />,
      color: "from-[#121418] to-[#121418]",
      accent: "text-rose-500 bg-rose-500/10",
      border: "border-rose-500/20",
      subtitle: "Total Spending"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`relative p-8 rounded-[2.5rem] bg-gradient-to-br ${card.color} border ${card.border || 'border-white/5'} shadow-2xl overflow-hidden`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${card.isMain ? 'text-indigo-200' : 'text-slate-500'}`}>
                {card.title}
              </span>
              <span className="text-[8px] font-medium text-slate-500/80 uppercase tracking-tighter mt-1">
                {card.subtitle}
              </span>
            </div>
            <div className={`p-3 rounded-2xl ${card.accent}`}>
              {card.icon}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className={`text-4xl font-black italic tracking-tighter ${card.isMain ? 'text-white' : 'text-slate-100'}`}>
              ₹{card.amount.toLocaleString('en-IN')}
            </h2>
            
            {/* Logic for Outflow Progress Bar */}
            {!card.isMain && card.title === "Total Outflow" && (
              <div className="mt-4">
                <div className="flex justify-between text-[8px] font-bold text-slate-500 mb-1">
                  <span>USAGE OF INCOME</span>
                  <span className={spendRatio > 90 ? "text-rose-500" : ""}>{spendRatio.toFixed(1)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(spendRatio, 100)}%` }}
                    className={`h-full ${spendRatio > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                  />
                </div>
              </div>
            )}

            {/* Added: Mini Insight for Income Card */}
            {!card.isMain && card.title === "Total Inflow" && (
                <div className="flex items-center gap-1 mt-4 opacity-50">
                    <FaChartPie size={8} className="text-emerald-500"/>
                    <span className="text-[8px] font-black text-slate-500 uppercase">Growth tracking active</span>
                </div>
            )}
          </div>
          
          {card.isMain && (
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;