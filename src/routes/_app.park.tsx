import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/park")({
  head: () => ({ meta: [{ title: "Park Vehicle — Smart Parking System" }] }),
  component: ParkVehicle,
});

function ParkVehicle() {
  const [form, setForm] = useState({
    plate_number: "",
    owner_name: "",
    owner_phone: "",
    vehicle_type: "CAR",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plate_number || !form.owner_name) {
      toast.error("Plate number and owner name required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/park", form);
      setResult(res.data);
      toast.success(`Parked Successfully! Slot: ${res.data?.slot_id} — Ticket: ${res.data?.ticket_id}`);
      setForm({ plate_number: "", owner_name: "", owner_phone: "", vehicle_type: "CAR" });
    } catch (err: any) {
      toast.error(err?.response?.data || "Failed to park vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Park Vehicle" subtitle="Issue a new parking ticket" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-4">
          <Field label="Plate Number" value={form.plate_number} onChange={(v) => update("plate_number", v.toUpperCase())} placeholder="ABC-1234" />
          <Field label="Owner Name" value={form.owner_name} onChange={(v) => update("owner_name", v)} placeholder="Ali Raza" />
          <Field label="Phone" value={form.owner_phone} onChange={(v) => update("owner_phone", v)} placeholder="03001234567" />
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Vehicle Type</label>
            <select
              value={form.vehicle_type}
              onChange={(e) => update("vehicle_type", e.target.value)}
              className="mt-1 w-full bg-input/60 border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="CAR">🚗 Car</option>
              <option value="BIKE">🏍️ Bike</option>
              <option value="TRUCK">🚛 Truck</option>
            </select>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-2 text-xs text-muted-foreground">
            💡 Slot will be automatically assigned based on vehicle type
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Spinner /> : "🅿 Park & Assign Slot"}
          </button>
        </form>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Latest Ticket</h3>
          {!result ? (
            <p className="text-sm text-muted-foreground">After parking a vehicle, the ticket details appear here.</p>
          ) : (
            <div className="space-y-2 text-sm">
              <Row k="Ticket ID" v={result.ticket_id} />
              <Row k="Assigned Slot" v={result.slot_id} />
              <Row k="Message" v={result.message} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-input/60 border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex justify-between border-b border-border py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{String(v ?? "—")}</span>
    </div>
  );
}
