import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type Ticket } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/_app/tickets")({
  head: () => ({ meta: [{ title: "Active Tickets – Smart Parking System" }] }),
  component: Tickets,
});

function Tickets() {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/active-tickets").then((r) => setData(r.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Active Tickets" subtitle="Vehicles currently parked" />
      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          data={data}
          searchKeys={["plate_number", "owner_name", "ticket_id"]}
          columns={[
            { key: "ticket_id", label: "Ticket ID" },
            { key: "plate_number", label: "Plate" },
            { key: "owner_name", label: "Owner" },
            { key: "vehicle_type", label: "Type", render: (r) => <Badge type={r.vehicle_type} /> },
            { key: "slot_id", label: "Slot" },
            { key: "entry_time", label: "Entry Time" },
          ]}
        />
      )}
    </>
  );
}

function Badge({ type }: { type: string }) {
  const cls =
    type === "CAR" ? "bg-primary/15 text-primary"
    : type === "BIKE" ? "bg-emerald-500/15 text-emerald-400"
    : "bg-amber-500/15 text-amber-400";
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{type}</span>;
}
