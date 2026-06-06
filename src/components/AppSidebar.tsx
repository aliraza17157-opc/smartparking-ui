import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CarFront,
  LogOut,
  Ticket,
  History,
  BarChart3,
  BookmarkCheck,
  ParkingSquare,
  CircleParking,
  ParkingMeter,
} from "lucide-react";

const allItems = [
  { to: "/",         label: "Dashboard",      icon: LayoutDashboard, adminOnly: false, color: "" },
  { to: "/park",     label: "Park Vehicle",   icon: CarFront,        adminOnly: false, color: "" },
  { to: "/unpark",   label: "Unpark Vehicle", icon: ParkingSquare,   adminOnly: false, color: "" },
  { to: "/tickets",  label: "Active Tickets", icon: Ticket,          adminOnly: false, color: "" },
  { to: "/history",  label: "Ticket History", icon: History,         adminOnly: false, color: "" },
  { to: "/slots",    label: "Slot Status",    icon: ParkingMeter,    adminOnly: false, color: "text-emerald-400" },
  { to: "/revenue",  label: "Revenue Report", icon: BarChart3,       adminOnly: true,  color: "" },
  { to: "/reserved", label: "Reserved Slots", icon: BookmarkCheck,   adminOnly: false, color: "text-amber-400" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const auth = typeof window !== "undefined" ? localStorage.getItem("spms_auth") : null;
  const user = auth ? JSON.parse(auth) : null;
  const isAdmin = user?.role === "ADMIN";

  const items = allItems.filter((item) => !item.adminOnly || isAdmin);

  const logout = () => {
    localStorage.removeItem("spms_auth");
    navigate({ to: "/login" });
  };

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      {/* Logo & Brand */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/20 text-accent flex items-center justify-center gold-glow">
            <CircleParking className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold leading-tight text-white">Smart Parking System</div>
            <div className="text-xs text-muted-foreground">Parking Management System</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 px-2 py-2 rounded-lg bg-sidebar-accent/50 border border-sidebar-border/60">
          <ParkingMeter className="w-4 h-4 text-accent" />
          <span className="text-xs text-sidebar-foreground/70 tracking-wide uppercase">
            {isAdmin ? "👑 Admin" : "🚗 Operator"}: {user?.username}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary text-white shadow-md border-l-2 border-accent"
                  : `hover:bg-sidebar-accent hover:text-sidebar-foreground ${it.color || "text-sidebar-foreground/80"}`
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "" : it.color}`} />
              {it.label}
              {it.adminOnly && (
                <span className="ml-auto text-xs text-accent">[ADMIN]</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-destructive/15 hover:text-destructive transition-colors"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  );
}
