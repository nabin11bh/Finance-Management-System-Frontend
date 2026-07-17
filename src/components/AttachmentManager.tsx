"use client";

import { useRef, useState } from "react";
import {
  useListAttachmentsQuery,
  useUploadAttachmentsMutation,
  useDeleteAttachmentMutation,
} from "@/store/api/attachmentApi";
import { getErrorMessage } from "@/lib/apiError";

type EntityType = "income" | "expense" | "reminder";

function formatFileSize(bytes: string) {
  const kb = Number(bytes) / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
}

export default function AttachmentManager({ entityType, entityId }: { entityType: EntityType; entityId: string }) {
  const { data: attachments, isLoading } = useListAttachmentsQuery({ entityType, entityId });
  const [uploadAttachments, { isLoading: isUploading }] = useUploadAttachmentsMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    try {
      await uploadAttachments({ entityType, entityId, files: Array.from(files) }).unwrap();
    } catch (err) {
      setError(getErrorMessage(err, "Upload failed."));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this attachment?")) return;
    await deleteAttachment(id);
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-xs font-medium border border-slate-300 rounded-md px-2 py-1 hover:bg-slate-50 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "📎 Attach file"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {isLoading ? (
        <p className="text-xs text-slate-400">Loading attachments…</p>
      ) : attachments && attachments.length > 0 ? (
        <ul className="space-y-1">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center justify-between text-xs bg-slate-50 rounded px-2 py-1">
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/attachments/file/${a.id}`} target="_blank" rel="noreferrer" className="text-brand hover:underline truncate">
                {a.fileName} <span className="text-slate-400">({formatFileSize(a.fileSize)})</span>
              </a>
              <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:underline ml-2 shrink-0">
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-slate-400">No attachments yet.</p>
      )}
    </div>
  );
}