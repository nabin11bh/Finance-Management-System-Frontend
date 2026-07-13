import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";
import type { RootState } from "@/store";
import { setAccessToken, clearAuth } from "@/store/slices/authSlice";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

export const axiosBaseQuery = (): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> => {
  return async ({ url, method = "GET", data, params }, api) => {
    const state = api.getState() as RootState;
    const token = state.auth.accessToken;

    const run = () =>
      axiosInstance({
        url,
        method,
        data,
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

    try {
      const result = await run();
      return { data: result.data.data ?? result.data, meta: result.data.meta };
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: { code: string; message: string } }>;

      if (axiosError.response?.status === 401 && url !== "/auth/refresh" && url !== "/auth/login") {
        if (isRefreshing) {
          await new Promise<void>((resolve) => refreshQueue.push(resolve));
        } else {
          isRefreshing = true;
          try {
            const refreshRes = await axiosInstance.post("/auth/refresh");
            api.dispatch(setAccessToken(refreshRes.data.data.accessToken));
            refreshQueue.forEach((resolve) => resolve());
            refreshQueue = [];
          } catch {
            api.dispatch(clearAuth());
            refreshQueue = [];
            return { error: { status: 401, data: { code: "SESSION_EXPIRED", message: "Session expired" } } };
          } finally {
            isRefreshing = false;
          }
        }

        try {
          const retryToken = (api.getState() as RootState).auth.accessToken;
          const retryResult = await axiosInstance({
            url,
            method,
            data,
            params,
            headers: retryToken ? { Authorization: `Bearer ${retryToken}` } : undefined,
          });
          return { data: retryResult.data.data ?? retryResult.data, meta: retryResult.data.meta };
        } catch (retryError) {
          const retryAxiosError = retryError as AxiosError<{ error?: { code: string; message: string } }>;
          return {
            error: {
              status: retryAxiosError.response?.status,
              data: retryAxiosError.response?.data?.error ?? { message: "Request failed" },
            },
          };
        }
      }

      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data?.error ?? { message: "Request failed" },
        },
      };
    }
  };
};