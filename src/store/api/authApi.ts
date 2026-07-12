import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({ url: "/auth/login", method: "POST", data: credentials }),
    }),
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    me: builder.query<AuthUser, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation, useMeQuery, useLazyMeQuery } = authApi;