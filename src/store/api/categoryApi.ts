import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface IncomeCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface ExpenseCategory {
  id: string;
  groupName: string;
  name: string;
  description: string | null;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getIncomeCategories: builder.query<IncomeCategory[], void>({
      query: () => ({ url: "/income-categories", method: "GET" }),
    }),
    getExpenseCategories: builder.query<ExpenseCategory[], void>({
      query: () => ({ url: "/expense-categories", method: "GET" }),
    }),
  }),
});

export const { useGetIncomeCategoriesQuery, useGetExpenseCategoriesQuery } = categoryApi;