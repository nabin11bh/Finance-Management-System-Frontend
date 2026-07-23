"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useListIncomeQuery, useDeleteIncomeMutation } from "@/store/api/incomeApi";
import { useGetIncomeCategoriesQuery } from "@/store/api/categoryApi";
import AttachmentManager from "@/components/AttachmentManager";

function formatNPR(amount: string) {
  return `Rs. ${Number(amount).toLocaleString("en-NP", { minimumFractionDigits: 2 })}`;
}

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "eSewa", "Khalti", "Other"];

export default function IncomeListPage() {
  const [filters, setFilters] = useState({
    search: "",
    from: "",
    to: "",
    category_id: "",
    payment_method: "",
  });
  const [page, setPage] = useState(1);

  const { data: categories } = useGetIncomeCategoriesQuery();
  const { data, isLoading } = useListIncomeQuery({
    page,
    search: filters.search || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    category_id: filters.category_id || undefined,
    payment_method: filters.payment_method || undefined,
  });
  const [deleteIncome] = useDeleteIncomeMutation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1); // reset to page 1 whenever a filter changes
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this income record?")) return;
    await deleteIncome(id);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Income</h1>
        <Link
          href="/accountant/income/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          + New Income
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-slate-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Client, description, invoice…"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
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
              <option key={c.id} value={c.id}>{c.name}</option>
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
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data?.records.map((income) => (
                  <Fragment key={income.id}>
                    <tr className="border-t border-slate-100">
                      <td className="px-4 py-3">{new Date(income.transactionDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{income.category.name}</td>
                      <td className="px-4 py-3">{income.clientName ?? "—"}</td>
                      <td className="px-4 py-3">{income.paymentMethod}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-700">{formatNPR(income.amount)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === income.id ? null : income.id)}
                          className="text-brand hover:underline text-xs mr-3"
                        >
                          {expandedId === income.id ? "Hide" : "Attachments"}
                        </button>
                        <button
                          onClick={() => handleDelete(income.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === income.id && (
                      <tr>
                        <td colSpan={6} className="px-4 pb-3 bg-slate-50">
                          <AttachmentManager entityType="income" entityId={income.id} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {data?.records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No income records match your filters.
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