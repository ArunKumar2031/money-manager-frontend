import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const ExpenseChart = ({ data }) => {
  const isDarkMode = document.documentElement.classList.contains("dark");

  if (!data || data.length === 0) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2rem] bg-slate-50/50 dark:bg-transparent">
      <div className="mb-2 opacity-20 text-2xl">📊</div>
      Waiting for Analytics
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Define the gradient for the bars */}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
            <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        <CartesianGrid 
          strokeDasharray="4 4" 
          vertical={false} 
          stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
        />
        
        <XAxis 
          dataKey="category" 
          axisLine={false} 
          tickLine={false} 
          tick={{ 
            fill: isDarkMode ? "#64748b" : "#94a3b8", 
            fontSize: 10, 
            fontWeight: "700" 
          }} 
          dy={10}
        />
        
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ 
            fill: isDarkMode ? "#475569" : "#94a3b8", 
            fontSize: 10,
            fontWeight: "600"
          }} 
        />

        <Tooltip
          cursor={{ fill: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
          contentStyle={{ 
            backgroundColor: isDarkMode ? "#121418" : "#ffffff", 
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            padding: "12px"
          }}
          itemStyle={{ 
            color: "#6366f1", 
            fontSize: "12px", 
            fontWeight: "bold",
            textTransform: "uppercase"
          }}
          labelStyle={{
            color: isDarkMode ? "#94a3b8" : "#64748b",
            fontSize: "10px",
            marginBottom: "4px",
            fontWeight: "bold"
          }}
          formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
        />

        {/* Bar updated with the gradient ID defined in <defs> */}
        <Bar 
          dataKey="amount" 
          radius={[10, 10, 10, 10]} 
          barSize={24}
          fill="url(#barGradient)" 
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              className="hover:opacity-80 transition-opacity cursor-pointer shadow-2xl"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;