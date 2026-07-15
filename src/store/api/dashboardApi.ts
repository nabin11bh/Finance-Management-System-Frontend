import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

interface PeriodKpi {
  income: number;
  expense: number;
  profit: number;
}

export interface Kpis {
  today: PeriodKpi;
  week: PeriodKpi;
  month: PeriodKpi;
  year: PeriodKpi;
}

export interface ChartPoint {
  label: string;
  income: number;
  expense: number;
  profit: number;
}

export interface CategorySlice {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthlyCashFlowPoint {
  month: number;
  income: number;
  expense: number;
  profit: number;
}

export interface RecentTransaction {
  id: string;
  type: "income" | "expense";
  date: string;
  amount: number;
  category: string;
  counterparty: string | null;
}

export interface UpcomingReminder {
  id: string;
  title: string;
  reminderDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getKpis: builder.query<Kpis, void>({
      query: () => ({ url: "/dashboard/kpis", method: "GET" }),
    }),
    getIncomeExpenseChart: builder.query<ChartPoint[], "daily" | "weekly" | "monthly" | "yearly">({
      query: (period) => ({ url: "/dashboard/income-expense-chart", method: "GET", params: { period } }),
    }),
    getIncomeByCategory: builder.query<CategorySlice[], void>({
      query: () => ({ url: "/dashboard/income-by-category", method: "GET" }),
    }),
    getExpenseByCategory: builder.query<CategorySlice[], void>({
      query: () => ({ url: "/dashboard/expense-by-category", method: "GET" }),
    }),
    getMonthlyCashFlow: builder.query<MonthlyCashFlowPoint[], number>({
      query: (year) => ({ url: "/dashboard/monthly-cash-flow", method: "GET", params: { year } }),
    }),
    getRecentTransactions: builder.query<RecentTransaction[], void>({
      query: () => ({ url: "/dashboard/recent-transactions", method: "GET" }),
    }),
    getUpcomingReminders: builder.query<UpcomingReminder[], void>({
      query: () => ({ url: "/dashboard/upcoming-reminders", method: "GET" }),
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetIncomeExpenseChartQuery,
  useGetIncomeByCategoryQuery,
  useGetExpenseByCategoryQuery,
  useGetMonthlyCashFlowQuery,
  useGetRecentTransactionsQuery,
  useGetUpcomingRemindersQuery
} = dashboardApi;