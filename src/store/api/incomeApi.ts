import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Income {
  id: string;
  transactionDate: string;
  amount: string;
  incomeCategoryId: string;
  incomeSource: string | null;
  clientName: string | null;
  paymentMethod: string;
  referenceNumber: string | null;
  invoiceNumber: string | null;
  description: string | null;
  category: { id: string; name: string };
}

export interface CreateIncomeInput {
  transactionDate: string;
  amount: number;
  incomeCategoryId: string;
  incomeSource?: string;
  clientName?: string;
  paymentMethod: string;
  referenceNumber?: string;
  invoiceNumber?: string;
  description?: string;
}

interface ListIncomeParams {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
  category_id?: string;
  payment_method?: string;
}

interface ListIncomeResponse {
  records: Income[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const incomeApi = createApi({
  reducerPath: "incomeApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Income"],
  endpoints: (builder) => ({
    listIncome: builder.query<ListIncomeResponse, ListIncomeParams | void>({
      query: (params) => ({ url: "/income", method: "GET", params: params ?? {} }),
      providesTags: ["Income"],
    }),
    createIncome: builder.mutation<Income, CreateIncomeInput>({
      query: (body) => ({ url: "/income", method: "POST", data: body }),
      invalidatesTags: ["Income"],
    }),
    deleteIncome: builder.mutation<void, string>({
      query: (id) => ({ url: `/income/${id}`, method: "DELETE" }),
      invalidatesTags: ["Income"],
    }),
  }),
});

export const { useListIncomeQuery, useCreateIncomeMutation, useDeleteIncomeMutation } = incomeApi;