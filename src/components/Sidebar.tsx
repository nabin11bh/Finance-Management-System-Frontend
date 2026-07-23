"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Tags,
  StickyNote,
  BellRing,
  FileBarChart,
  History,
  LogOut,
  X,
} from "lucide-react";
import { RootState } from "@/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { clearAuth } from "@/store/slices/authSlice";

const NAV_ITEMS = [
  { href: "/accountant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accountant/income", label: "Income", icon: ArrowDownCircle },
  { href: "/accountant/expense", label: "Expense", icon: ArrowUpCircle },
  { href: "/accountant/categories", label: "Categories", icon: Tags },
  { href: "/accountant/notes", label: "Notes", icon: StickyNote },
  { href: "/accountant/reminders", label: "Reminders", icon: BellRing },
  { href: "/accountant/reports", label: "Reports", icon: FileBarChart },
  { href: "/accountant/audit", label: "Audit Trail", icon: History },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [logout] = useLogoutMutation();

  async function handleLogout() {
    await logout();
    dispatch(clearAuth());
    router.push("/auth/login");
  }

  return (
    <div className="flex flex-col h-screen sticky top-0 bg-pine text-paper w-64 shrink-0">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full border border-brass flex items-center justify-center shrink-0">
            <span className="text-brass text-xs font-semibold">DP</span>
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-sm font-medium text-paper truncate">Digital Pathshala</p>
            <p className="text-[11px] text-paper/50 tracking-wide truncate">Finance System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-paper/60 hover:text-paper shrink-0">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/accountant" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-paper font-medium"
                  : "text-paper/60 hover:bg-white/5 hover:text-paper"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} className="shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 shrink-0">
        <div className="px-3 pb-3 min-w-0">
          <p className="text-sm text-paper truncate">{user?.fullName}</p>
          <p className="text-xs text-paper/50 truncate">{user?.roles.join(", ")}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-paper/70 hover:bg-white/5 hover:text-paper transition-colors"
        >
          <LogOut size={17} strokeWidth={1.75} className="shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}