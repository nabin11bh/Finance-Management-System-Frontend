import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface AuditLogEntry {
  id: string;
  userName: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
}

interface ListAuditResponse {
  records: AuditLogEntry[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const auditApi = createApi({
  reducerPath: "auditApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    listAuditLogs: builder.query<ListAuditResponse, { page?: number } | void>({
      query: (params) => ({ url: "/audit-logs", method: "GET", params: params ?? {} }),
    }),
  }),
});

export const { useListAuditLogsQuery } = auditApi;