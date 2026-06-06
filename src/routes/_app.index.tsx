import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Car,
  ParkingSquare,
  IndianRupee,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Dashboard — Smart Parking System" }] }),
  component: Dashboard,
});

type Stats = {
  totalParked: number;
  availableSlots: number;
  todayRevenue: number;
  totalVehicles: number;
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold mt-2">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalParked: 0,
    availableSlots: 0,
    todayRevenue: 0,
    totalVehicles: 0,
  });
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, a] = await Promise.all([
          api.get("/stats").then((r) => r.data).catch(() => null),
          api.get("/tickets/recent").then((r) => r.data).catch(() => []),
        ]);
        if (cancelled) return;
        if (s) setStats(s);

        // API returns both Entry and Exit with "action" field
        if (Array.isArray(a) && a.length) {
          setActivity(a.map((item: any) => ({
            ticketId: item.ticket_id,
            plateNumber: item.plate_number,
            ownerName: item.owner_name,
            vehicleType: item.vehicle_type,
            action: item.action, // "Entry" or "Exit"
            time: item.entry_time,
          })));
        } else {
          setActivity([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-muted-foreground"><Spinner /></div>
    );

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of parking operations" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Parked" value={stats.totalParked} icon={Car} accent="bg-primary/15 text-primary" />
        <StatCard label="Available Slots" value={stats.availableSlots} icon={ParkingSquare} accent="bg-emerald-500/15 text-emerald-400" />
        <StatCard label="Today Revenue" value={`₹${stats.todayRevenue}`} icon={IndianRupee} accent="bg-amber-500/15 text-accent" />
        <StatCard label="Total Vehicles" value={stats.totalVehicles} icon={Users} accent="bg-sky-500/15 text-sky-400" />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Activity</h2>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a, i) => (
                <li key={i} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{a.plateNumber}</p>
                    <p className="text-xs text-muted-foreground">{a.ticketId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    a.action === "Entry"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-amber-500/15 text-amber-400"
                  }`}>
                    {a.action === "Entry" ? "🟢 Entry" : "🔴 Exit"}
                  </span>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Occupancy</h2>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-center py-4">
            <p className="text-5xl font-semibold text-primary">
              {Math.round((stats.totalParked / (stats.totalParked + stats.availableSlots)) * 100) || 0}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">Lot capacity in use</p>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden mt-4">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(stats.totalParked / (stats.totalParked + stats.availableSlots)) * 100 || 0}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
