"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { CategorySlice } from "@/store/api/dashboardApi";

const COLORS = ["#0f766e", "#15803d", "#b91c1c", "#a16207", "#6d28d9", "#be185d", "#0369a1", "#c2410c"];

export default function CategoryPieChart({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: CategorySlice[] | undefined;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-slate-400">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              outerRadius={80}
            label={(entry) => `${entry.payload.percentage}%`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}