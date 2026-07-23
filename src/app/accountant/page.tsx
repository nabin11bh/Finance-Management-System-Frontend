"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import KpiCards from "./dashboard/KpiCards";
import IncomeExpenseChart from "./dashboard/IncomeExpenseChart";
import CategoryPieChart from "./dashboard/CategoryPieChart";
import MonthlyCashFlowChart from "./dashboard/MonthlyCashFlowChart";
import RecentTransactions from "./dashboard/RecentTransactions";
import UpcomingReminders from "./dashboard/UpcomingReminders";
import { useGetIncomeByCategoryQuery, useGetExpenseByCategoryQuery } from "@/store/api/dashboardApi";

export default function AccountantHome() {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: incomeByCategory, isLoading: loadingIncomeCat } = useGetIncomeByCategoryQuery();
  const { data: expenseByCategory, isLoading: loadingExpenseCat } = useGetExpenseByCategoryQuery();

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Welcome, {user?.fullName}</h1>
        <p className="text-sm text-ink/50 mt-0.5">Here is your financial overview.</p>
      </div>

      <KpiCards />

      <IncomeExpenseChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryPieChart title="Income by Category" data={incomeByCategory} isLoading={loadingIncomeCat} />
        <CategoryPieChart title="Expense by Category" data={expenseByCategory} isLoading={loadingExpenseCat} />
      </div>

      <MonthlyCashFlowChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentTransactions />
        <UpcomingReminders />
      </div>
    </div>
  );
}