"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RootState } from "@/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { clearAuth } from "@/store/slices/authSlice";
import KpiCards from "./dashboard/KpiCards";
import IncomeExpenseChart from "./dashboard/IncomeExpenseChart";
import CategoryPieChart from "./dashboard/CategoryPieChart";
import MonthlyCashFlowChart from "./dashboard/MonthlyCashFlowChart";
import RecentTransactions from "./dashboard/RecentTransactions";
import UpcomingReminders from "./dashboard/UpcomingReminders";
import { useGetIncomeByCategoryQuery, useGetExpenseByCategoryQuery } from "@/store/api/dashboardApi";

export default function AccountantHome() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logout] = useLogoutMutation();

  const { data: incomeByCategory, isLoading: loadingIncomeCat } = useGetIncomeByCategoryQuery();
  const { data: expenseByCategory, isLoading: loadingExpenseCat } = useGetExpenseByCategoryQuery();

  async function handleLogout() {
    await logout();
    dispatch(clearAuth());
    router.push("/auth/login");
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.fullName}</h1>
          <p className="text-sm text-slate-500">Logged in as: {user?.roles.join(", ")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/accountant/income" className="text-sm font-medium text-brand hover:underline">
            Income
          </Link>
          <Link href="/accountant/expense" className="text-sm font-medium text-brand hover:underline">
            Expense
          </Link>
          <Link href="/accountant/categories" className="text-sm font-medium text-brand hover:underline">
            Categories
          </Link>
          <Link href="/accountant/notes" className="text-sm font-medium text-brand hover:underline">
            Notes
          </Link>
          <Link href="/accountant/reminders" className="text-sm font-medium text-brand hover:underline">
            Reminders
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      <KpiCards />

      <IncomeExpenseChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryPieChart title="Income by Category" data={incomeByCategory} isLoading={loadingIncomeCat} />
        <CategoryPieChart title="Expense by Category" data={expenseByCategory} isLoading={loadingExpenseCat} />
      </div>

      <MonthlyCashFlowChart />

      <RecentTransactions />
      <UpcomingReminders />
    </div>
  );
}