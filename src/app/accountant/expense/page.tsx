"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useListExpenseQuery, useDeleteExpenseMutation } from "@/store/api/expenseApi";
import { useGetExpenseCategoriesQuery } from "@/store/api/categoryApi";
import AttachmentManager from "@/components/AttachmentManager";

function formatNPR(amount: string) {
  return `Rs. ${Number(amount).toLocaleString("en-NP", { minimumFractionDigits: 2 })}`;
}

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "eSewa", "Khalti", "Other"];

export default function ExpenseListPage() {
  const [filters, setFilters] = useState({
    vendor_name: "",
    from: "",
    to: "",
    category_id: "",
    payment_method: "",
  });
  const [page, setPage] = useState(1);

  const { data: categories } = useGetExpenseCategoriesQuery();
  const { data, isLoading } = useListExpenseQuery({
    page,
    vendor_name: filters.vendor_name || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    category_id: filters.category_id || undefined,
    payment_method: filters.payment_method || undefined,
  });
  const [deleteExpense] = useDeleteExpenseMutation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

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

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-slate-700 mb-1">Vendor</label>
          <input
            type="text"
            placeholder="Search by vendor name…"
            value={filters.vendor_name}
            onChange={(e) => updateFilter("vendor_name", e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">From</label>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => updateFilter("from", e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">To</label>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => updateFilter("to", e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
          <select
            value={filters.category_id}
            onChange={(e) => updateFilter("category_id", e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.groupName} / {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Payment</label>
          <select
            value={filters.payment_method}
            onChange={(e) => updateFilter("payment_method", e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <>
         <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
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
                  <Fragment key={expense.id}>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-3">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {expense.category.groupName} / {expense.category.name}
                      </td>
                      <td className="px-4 py-3">{expense.vendorName ?? "—"}</td>
                      <td className="px-4 py-3">{expense.paymentMethod}</td>
                      <td className="px-4 py-3 text-right font-medium text-red-700">{formatNPR(expense.amount)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === expense.id ? null : expense.id)}
                          className="text-brand hover:underline text-xs mr-3"
                        >
                          {expandedId === expense.id ? "Hide" : "Attachments"}
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === expense.id && (
                      <tr>
                        <td colSpan={6} className="px-4 pb-3 bg-slate-50">
                          <AttachmentManager entityType="expense" entityId={expense.id} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {data?.records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No expense records match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}