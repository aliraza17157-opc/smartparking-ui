import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CircleParking, Lock, User } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Smart Parking System" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", { username, password });
      const user = res.data;
      localStorage.setItem("spms_auth", JSON.stringify(user));

      if (user.role === "ADMIN") {
        toast.success(`Welcome, Admin ${user.username}! 👑`);
      } else {
        toast.success(`Welcome, Operator ${user.username}! 🚗`);
      }

      navigate({ to: "/" });
    } catch (err: any) {
      const msg = "Invalid username or password!";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_45%)] opacity-15 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 card-glow">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/25 text-accent flex items-center justify-center mb-4 gold-glow">
              <CircleParking className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Smart Parking System</h1>
            <p className="text-sm text-muted-foreground mt-1">Parking Management System</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Username</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="w-full bg-input/60 border border-border rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="admin"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted-foreground">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full bg-input/60 border border-border rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/30 rounded-md px-3 py-2 text-sm text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full mt-2 bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Spinner /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Smart Parking Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
