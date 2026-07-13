"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGetIncomeExpenseChartQuery } from "@/store/api/dashboardApi";

type Period = "daily" | "weekly" | "monthly" | "yearly";

export default function IncomeExpenseChart() {
  const [period, setPeriod] = useState<Period>("monthly");
  const { data, isLoading } = useGetIncomeExpenseChartQuery(period);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Income vs Expense</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="text-xs border border-slate-300 rounded-md px-2 py-1"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#15803d" name="Income" />
            <Bar dataKey="expense" fill="#b91c1c" name="Expense" />
            <Bar dataKey="profit" fill="#0f766e" name="Net Profit" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}