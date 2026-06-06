import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reserved")({
  head: () => ({ meta: [{ title: "Reserved Slots — Smart Parking System" }] }),
  component: Reserved,
});

function Reserved() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ slot_id: "", reserved_by: "", reserved_phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    api.get("/reserved").then((r) => setData(r.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slot_id || !form.reserved_by) {
      toast.error("Slot ID and Name required!");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/reserve", form);
      toast.success(`Slot ${form.slot_id} reserved successfully!`);
      setForm({ slot_id: "", reserved_by: "", reserved_phone: "" });
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data || "Failed to reserve slot");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Reserved Slots" subtitle="Pre-allocated parking spaces" />

      {/* Reserve Form */}
      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Reserve a Slot</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Slot ID</label>
            <input
              value={form.slot_id}
              onChange={(e) => update("slot_id", e.target.value.toUpperCase())}
              placeholder="C-05"
              className="mt-1 w-full bg-input/60 border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Reserved By</label>
            <input
              value={form.reserved_by}
              onChange={(e) => update("reserved_by", e.target.value)}
              placeholder="Ali Raza"
              className="mt-1 w-full bg-input/60 border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Phone</label>
            <input
              value={form.reserved_phone}
              onChange={(e) => update("reserved_phone", e.target.value)}
              placeholder="03001234567"
              className="mt-1 w-full bg-input/60 border border-border rounded-md px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <button
          disabled={submitting}
          className="mt-4 bg-primary text-primary-foreground rounded-md px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Reserving..." : "Reserve Slot"}
        </button>
      </form>

      {/* Reserved Slots Table */}
      {loading ? (
        <div className="flex justify-center py-20 text-muted-foreground"><Spinner /></div>
      ) : (
        <DataTable
          data={data}
          searchKeys={["slot_id", "reserved_by"]}
          columns={[
            { key: "slot_id", label: "Slot" },
            { key: "reserved_by", label: "Reserved By" },
            { key: "reserved_phone", label: "Phone" },
            { key: "reserved_time", label: "Reserved Time" },
          ]}
        />
      )}
    </>
  );
}
