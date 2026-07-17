"use client";

import { useState } from "react";
import { useListNotesQuery, useCreateNoteMutation, useTogglePinMutation, useDeleteNoteMutation } from "@/store/api/noteApi";
import { getErrorMessage } from "@/lib/apiError";

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListNotesQuery({
    page,
    search: search || undefined,
    is_archived: showArchived,
  });
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [togglePin] = useTogglePinMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createNote({ title, description }).unwrap();
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create note."));
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Notes</h1>

      <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
        <input
          type="text"
          required
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          required
          placeholder="Note content"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isCreating}
          className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-60"
        >
          {isCreating ? "Saving..." : "Add Note"}
        </button>
      </form>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => {
              setShowArchived(e.target.checked);
              setPage(1);
            }}
          />
          Show archived
        </label>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data?.records.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{note.title}</h3>
                  <button
                    onClick={() => togglePin({ id: note.id, isPinned: !note.isPinned })}
                    className={`text-xs ${note.isPinned ? "text-brand" : "text-slate-400"}`}
                  >
                    {note.isPinned ? "★ Pinned" : "☆ Pin"}
                  </button>
                </div>
                <p className="text-sm text-slate-600 mt-1">{note.description}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-xs text-red-600 hover:underline mt-2"
                >
                  Delete
                </button>
              </div>
            ))}
            {data?.records.length === 0 && (
              <p className="text-sm text-slate-400 col-span-2 text-center py-8">
                {showArchived ? "No archived notes." : "No notes found."}
              </p>
            )}
          </div>

          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
                className="px-3 py-1.5 border border-slate-300 rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}