"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateExpenseMutation } from "@/store/api/expenseApi";
import { useGetExpenseCategoriesQuery } from "@/store/api/categoryApi";
import { getErrorMessage } from "@/lib/apiError";

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "eSewa", "Khalti", "Other"];

export default function NewExpensePage() {
  const router = useRouter();
  const { data: categories } = useGetExpenseCategoriesQuery();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const [form, setForm] = useState({
    expenseDate: new Date().toISOString().slice(0, 10),
    amount: "",
    expenseCategoryId: "",
    vendorName: "",
    paymentMethod: "Cash",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createExpense({
        ...form,
        amount: Number(form.amount),
      }).unwrap();
      router.push("/accountant/expense");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create expense record."));
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">New Expense</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Expense Date</label>
          <input
            type="date"
            required
            value={form.expenseDate}
            onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Amount (NPR)</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            required
            value={form.expenseCategoryId}
            onChange={(e) => setForm({ ...form, expenseCategoryId: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.groupName} / {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
          <input
            type="text"
            value={form.vendorName}
            onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
          <select
            required
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2 rounded-md disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save Expense"}
        </button>
      </form>
    </div>
  );
}