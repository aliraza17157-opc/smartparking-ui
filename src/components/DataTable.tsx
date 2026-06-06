import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys,
  empty = "No records",
}: {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  empty?: string;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return data;
    const lower = q.toLowerCase();
    return data.filter((row) =>
      (searchKeys ?? (Object.keys(row) as (keyof T)[])).some((k) =>
        String(row[k] ?? "").toLowerCase().includes(lower),
      ),
    );
  }, [q, data, searchKeys]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full bg-input/60 border border-border rounded-md pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground bg-background/40">
              {columns.map((c) => (
                <th key={String(c.key)} className="px-4 py-3 font-medium">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-muted-foreground">{empty}</td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-background/40 transition-colors">
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3">
                      {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
