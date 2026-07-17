"use client";

import { useGetIncomeCategoriesQuery, useGetExpenseCategoriesQuery } from "@/store/api/categoryApi";

export default function CategoriesPage() {
  const { data: incomeCategories, isLoading: loadingIncome } = useGetIncomeCategoriesQuery();
  const { data: expenseCategories, isLoading: loadingExpense } = useGetExpenseCategoriesQuery();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Income Categories {incomeCategories && `(${incomeCategories.length})`}
        </h2>
        {loadingIncome ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {incomeCategories?.map((cat) => (
              <div key={cat.id} className="bg-white border border-slate-200 rounded-lg p-3">
                <p className="text-sm uppercase tracking-wide text-brand font font-semibold">{cat.name}</p>
                <p className="text-sm font font-medium text-slate-500 mt-1">{cat.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Expense Categories {expenseCategories && `(${expenseCategories.length})`}
        </h2>
        {loadingExpense ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {expenseCategories?.map((cat) => (
              <div key={cat.id} className="bg-white border border-slate-200 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wide text-brand font-semibold">{cat.groupName}</p>
                <p className="text-sm font-medium text-slate-500">{cat.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}