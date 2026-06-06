import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/_app/slots")({
  head: () => ({ meta: [{ title: "Slot Status — Smart Parking System" }] }),
  component: SlotStatus,
});

function SlotStatus() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api.get("/slots/status")
      .then((r) => setSlots(r.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  const cars = slots.filter((s) => s.type === "CAR");
  const bikes = slots.filter((s) => s.type === "BIKE");
  const trucks = slots.filter((s) => s.type === "TRUCK");

  const filtered = filter === "ALL" ? slots : slots.filter((s) => s.type === filter);

  const occupied = slots.filter((s) => s.status === "OCCUPIED").length;
  const free = slots.filter((s) => s.status === "FREE").length;

  return (
    <>
      <PageHeader title="Slot Status" subtitle="Real-time parking slot availability" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-emerald-400">{free}</p>
          <p className="text-xs text-muted-foreground mt-1">Available</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-red-400">{occupied}</p>
          <p className="text-xs text-muted-foreground mt-1">Occupied</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-semibold text-primary">{slots.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["ALL", "CAR", "BIKE", "TRUCK"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted-foreground hover:text-white"
            }`}
          >
            {f === "ALL" ? "All" : f === "CAR" ? "🚗 Cars" : f === "BIKE" ? "🏍️ Bikes" : "🚛 Trucks"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filtered.map((slot) => (
            <div
              key={slot.slot_id}
              className={`rounded-lg p-2 text-center text-xs font-medium border transition-all ${
                slot.status === "OCCUPIED"
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              }`}
            >
              <p>{slot.slot_id}</p>
              <p className="text-[10px] opacity-70">F{slot.floor}</p>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-500/40 inline-block"/> Free
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500/40 inline-block"/> Occupied
        </span>
      </div>
    </>
  );
}
