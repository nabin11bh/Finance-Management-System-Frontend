import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Note {
  id: string;
  title: string;
  description: string;
  colorLabel: string | null;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface CreateNoteInput {
  title: string;
  description: string;
  colorLabel?: string;
}

interface ListNoteResponse {
  records: Note[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    listNotes: builder.query<ListNoteResponse, void>({
      query: () => ({ url: "/notes", method: "GET" }),
      providesTags: ["Note"],
    }),
    createNote: builder.mutation<Note, CreateNoteInput>({
      query: (body) => ({ url: "/notes", method: "POST", data: body }),
      invalidatesTags: ["Note"],
    }),
    togglePin: builder.mutation<Note, { id: string; isPinned: boolean }>({
      query: ({ id, isPinned }) => ({ url: `/notes/${id}/pin`, method: "PATCH", data: { isPinned } }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({ url: `/notes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const { useListNotesQuery, useCreateNoteMutation, useTogglePinMutation, useDeleteNoteMutation } = noteApi;