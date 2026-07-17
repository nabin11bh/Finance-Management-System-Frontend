"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useListIncomeQuery, useDeleteIncomeMutation } from "@/store/api/incomeApi";
import AttachmentManager from "@/components/AttachmentManager";

function formatNPR(amount: string) {
  return `Rs. ${Number(amount).toLocaleString("en-NP", { minimumFractionDigits: 2 })}`;
}

export default function IncomeListPage() {
  const { data, isLoading } = useListIncomeQuery();
  const [deleteIncome] = useDeleteIncomeMutation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
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
                    No income records yet.
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