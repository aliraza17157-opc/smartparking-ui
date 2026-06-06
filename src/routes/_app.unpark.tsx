import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_app/unpark")({
  head: () => ({ meta: [{ title: "Unpark — Smart Parking System" }] }),
  component: Unpark,
});

function Unpark() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/unpark", { plate_number: plate });
      setResult(res.data);
      toast.success(`Vehicle exited — Fee ₹${res.data?.fee ?? 0}`);
    } catch (err: any) {
      toast.error(err?.response?.data || "No active ticket found for this plate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Unpark Vehicle" subtitle="Look up an active ticket and settle the fee" />
      <form onSubmit={checkout} className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="Enter plate number"
            className="w-full bg-input/60 border border-border rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button disabled={loading} className="bg-primary text-primary-foreground rounded-md px-5 py-2.5 text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-60">
          {loading ? <Spinner /> : "Unpark Vehicle"}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Exit Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Detail k="Ticket ID" v={result.ticket_id} />
            <Detail k="Message" v={result.message} />
          </div>
          <div className="mt-6 flex items-center justify-between bg-accent/10 border border-accent/30 rounded-lg p-4">
            <span className="text-sm text-muted-foreground">Total Fee</span>
            <span className="text-2xl font-semibold text-accent">₹{result.fee ?? 0}</span>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ k, v }: { k: string; v: any }) {
  return (
    <div className="bg-background/50 border border-border rounded-md p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
      <p className="mt-1 font-medium">{String(v ?? "—")}</p>
    </div>
  );
}
