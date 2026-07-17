import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Expense {
  id: string;
  expenseDate: string;
  amount: string;
  expenseCategoryId: string;
  vendorName: string | null;
  paymentMethod: string;
  billNumber: string | null;
  description: string | null;
  category: { id: string; groupName: string; name: string };
}

export interface CreateExpenseInput {
  expenseDate: string;
  amount: number;
  expenseCategoryId: string;
  vendorName?: string;
  paymentMethod: string;
  billNumber?: string;
  description?: string;
}

interface ListExpenseParams {
  page?: number;
  limit?: number;
  search?: string;
  vendor_name?: string;
  from?: string;
  to?: string;
  category_id?: string;
  payment_method?: string;
}

interface ListExpenseResponse {
  records: Expense[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    listExpense: builder.query<ListExpenseResponse, ListExpenseParams | void>({
      query: (params) => ({ url: "/expense", method: "GET", params: params ?? {} }),
      providesTags: ["Expense"],
    }),
    createExpense: builder.mutation<Expense, CreateExpenseInput>({
      query: (body) => ({ url: "/expense", method: "POST", data: body }),
      invalidatesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({ url: `/expense/${id}`, method: "DELETE" }),
      invalidatesTags: ["Expense"],
    }),
  }),
});

export const { useListExpenseQuery, useCreateExpenseMutation, useDeleteExpenseMutation } = expenseApi;