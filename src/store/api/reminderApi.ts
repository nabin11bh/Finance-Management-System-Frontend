import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  reminderDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "COMPLETED";
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  reminderDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

interface ListReminderResponse {
  records: Reminder[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface ListReminderParams {
  page?: number;
  status?: "PENDING" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export const reminderApi = createApi({
  reducerPath: "reminderApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Reminder"],
  endpoints: (builder) => ({
    listReminders: builder.query<ListReminderResponse, ListReminderParams | void>({
      query: (params) => ({ url: "/reminders", method: "GET", params: params ?? {} }),
      providesTags: ["Reminder"],
    }),
    createReminder: builder.mutation<Reminder, CreateReminderInput>({
      query: (body) => ({ url: "/reminders", method: "POST", data: body }),
      invalidatesTags: ["Reminder"],
    }),
    markComplete: builder.mutation<Reminder, string>({
      query: (id) => ({ url: `/reminders/${id}/complete`, method: "PATCH" }),
      invalidatesTags: ["Reminder"],
    }),
    deleteReminder: builder.mutation<void, string>({
      query: (id) => ({ url: `/reminders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Reminder"],
    }),
  }),
});

export const {
  useListRemindersQuery,
  useCreateReminderMutation,
  useMarkCompleteMutation,
  useDeleteReminderMutation,
} = reminderApi;