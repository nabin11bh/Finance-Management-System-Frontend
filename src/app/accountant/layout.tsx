"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRefreshMutation, useLazyMeQuery } from "@/store/api/authApi";
import { setCredentials, setAccessToken, clearAuth } from "@/store/slices/authSlice";

export default function AccountantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [checking, setChecking] = useState(true);
  const [refresh] = useRefreshMutation();
  const [fetchMe] = useLazyMeQuery();

  useEffect(() => {
    // On hard refresh, accessToken is gone from memory — try to silently
    // refresh it using the httpOnly refresh cookie before bouncing to login.
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
    return <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading…</div>;
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}