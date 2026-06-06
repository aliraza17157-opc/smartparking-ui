import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type Ticket } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { Spinner } from "@/components/Spinner";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "Ticket History — Smart Parking System" }] }),
  component: History,
});

function History() {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/history").then((r) => setData(r.data || [])).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Ticket History" subtitle="All completed parking sessions" />
      {loading ? (
        <div className="flex justify-center py-20 text-muted-foreground"><Spinner /></div>
      ) : (
        <DataTable
          data={data}
          searchKeys={["plate_number", "owner_name", "ticket_id"]}
          columns={[
            { key: "ticket_id", label: "Ticket ID" },
            { key: "plate_number", label: "Plate" },
            { key: "vehicle_type", label: "Type" },
            { key: "entry_time", label: "Entry" },
            { key: "exit_time", label: "Exit" },
            { key: "fee", label: "Fee", render: (r) => <span className="font-medium text-accent">₹{r.fee ?? 0}</span> },
          ]}
        />
      )}
    </>
  );
}
