import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  storageUrl: string;
  createdAt: string;
}

type EntityType = "income" | "expense" | "reminder";

export const attachmentApi = createApi({
  reducerPath: "attachmentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Attachment"],
  endpoints: (builder) => ({
    listAttachments: builder.query<Attachment[], { entityType: EntityType; entityId: string }>({
      query: ({ entityType, entityId }) => ({ url: `/attachments/${entityType}/${entityId}`, method: "GET" }),
      providesTags: ["Attachment"],
    }),
    uploadAttachments: builder.mutation<Attachment[], { entityType: EntityType; entityId: string; files: File[] }>({
      query: ({ entityType, entityId, files }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        return { url: `/attachments/${entityType}/${entityId}`, method: "POST", data: formData };
      },
      invalidatesTags: ["Attachment"],
    }),
    deleteAttachment: builder.mutation<void, string>({
      query: (id) => ({ url: `/attachments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Attachment"],
    }),
  }),
});

export const { useListAttachmentsQuery, useUploadAttachmentsMutation, useDeleteAttachmentMutation } = attachmentApi;