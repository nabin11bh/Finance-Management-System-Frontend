"use client";

import Link from "next/link";
import { useListExpenseQuery, useDeleteExpenseMutation } from "@/store/api/expenseApi";

function formatNPR(amount: string) {
  return `Rs. ${Number(amount).toLocaleString("en-NP", { minimumFractionDigits: 2 })}`;
}

export default function ExpenseListPage() {
  const { data, isLoading } = useListExpenseQuery();
  const [deleteExpense] = useDeleteExpenseMutation();

  async function handleDelete(id: string) {
    if (!confirm("Delete this expense record?")) return;
    await deleteExpense(id);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Expense</h1>
        <Link
          href="/accountant/expense/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + New Expense
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.records.map((expense) => (
                <tr key={expense.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {expense.category.groupName} / {expense.category.name}
                  </td>
                  <td className="px-4 py-3">{expense.vendorName ?? "—"}</td>
                  <td className="px-4 py-3">{expense.paymentMethod}</td>
                  <td className="px-4 py-3 text-right font-medium text-red-700">{formatNPR(expense.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {data?.records.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No expense records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}