"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { clearAuth } from "@/store/slices/authSlice";

export default function AccountantHome() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logout] = useLogoutMutation();

  async function handleLogout() {
    await logout();
    dispatch(clearAuth());
    router.push("/auth/login");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome, {user?.fullName}</h1>
          <p className="text-sm text-slate-500">Logged in as: {user?.roles.join(", ")}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-md px-4 py-2"
        >
          Logout
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600 mb-4">
        Phase 1 complete: authentication working end-to-end.
      </div>
      <a href="/accountant/categories" className="text-sm font-medium text-brand hover:underline">
        View Categories →
      </a>
    </div>
  );
}