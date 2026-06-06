import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import { IndianRupee } from "lucide-react";

export const Route = createFileRoute("/_app/revenue")({
  head: () => ({ meta: [{ title: "Revenue Report — Smart Parking System" }] }),
  component: Revenue,
});

const COLORS = ["#F0A500", "#3B82F6", "#10B981", "#EF4444"];

function Revenue() {
  const [loading, setLoading] = useState(true);
  const [byType, setByType] = useState<{ type: string; revenue: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/revenue").then((res) => res.data).catch(() => null);
        if (r) {
          // API returns "breakdown" array with vehicle_type and revenue fields
          const breakdown = (r.breakdown || []).map((item: any) => ({
            type: item.vehicle_type,
            revenue: item.revenue,
            count: item.count,
          }));
          setByType(breakdown);
          setTotal(r.total || 0);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-muted-foreground"><Spinner /></div>;

  return (
    <>
      <PageHeader title="Revenue Report" subtitle="Earnings overview & breakdown" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-xl p-6 shadow-lg flex flex-col justify-between card-glow">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">Total Revenue</p>
            <p className="text-4xl font-semibold mt-2">₹{total.toLocaleString()}</p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm opacity-90">
            <IndianRupee className="w-4 h-4" /> All-time earnings
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Revenue by Vehicle Type (Bar)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0A0F1E", border: "1px solid #2A3A54", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="revenue" fill="#F0A500" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Revenue by Vehicle Type (Pie)</h3>
          {byType.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No revenue data yet</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byType} dataKey="revenue" nameKey="type" outerRadius={100} label>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ color: "#fff" }} />
                  <Tooltip contentStyle={{ background: "#0A0F1E", border: "1px solid #2A3A54", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Type Breakdown</h3>
          {byType.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No data yet — unpark vehicles to see revenue</p>
          ) : (
            <ul className="space-y-3">
              {byType.map((t, i) => (
                <li key={t.type} className="flex items-center justify-between text-sm border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {t.type}
                  </div>
                  <span className="font-medium">₹{t.revenue.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
