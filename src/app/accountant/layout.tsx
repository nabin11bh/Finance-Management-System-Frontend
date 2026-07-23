"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { RootState } from "@/store";
import { useRefreshMutation, useLazyMeQuery } from "@/store/api/authApi";
import { setCredentials, setAccessToken, clearAuth } from "@/store/slices/authSlice";
import Sidebar from "@/components/Sidebar";

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [checking, setChecking] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [refresh] = useRefreshMutation();
  const [fetchMe] = useLazyMeQuery();

  useEffect(() => {
    async function restoreSession() {
      if (accessToken) {
        setChecking(false);
        return;
      }
      try {
        const refreshResult = await refresh().unwrap();
        dispatch(setAccessToken(refreshResult.accessToken));
        const me = await fetchMe().unwrap();
        dispatch(setCredentials({ user: me, accessToken: refreshResult.accessToken }));
      } catch {
        dispatch(clearAuth());
        router.push("/auth/login");
      } finally {
        setChecking(false);
      }
    }
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink/50 text-sm">Loading…</div>
    );
  }

  return (
    <div className="h-screen flex bg-paper overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-mist bg-white shrink-0">
          <button onClick={() => setMobileNavOpen(true)} className="text-ink/60 hover:text-ink">
            <Menu size={22} />
          </button>
          <span className="text-sm font-medium text-ink">Digital Pathshala</span>
          <div className="w-[22px]" />
        </div>

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}