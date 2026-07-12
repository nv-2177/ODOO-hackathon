import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fuel, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { inputClass } from "../components/ui/Field";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("dispatcher@fleet.com");
  const [password, setPassword] = useState("dispatch123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-base)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-amber-soft)] flex items-center justify-center mb-3">
            <Fuel size={24} className="text-[var(--color-amber)]" />
          </div>
          <h1 className="font-display font-extrabold text-xl text-[var(--color-text)]">FleetOps</h1>
          <p className="text-sm text-[var(--color-text-faint)] mt-1">Fuel & Expense Management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6"
        >
          <label className="block mb-3.5">
            <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              required
            />
          </label>

          <label className="block mb-1">
            <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </label>

          {error && <p className="text-xs text-[var(--color-danger)] mt-2.5">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[var(--color-amber)] text-[#1A1305] hover:brightness-95 disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <div className="mt-4 bg-[var(--color-surface)]/60 border border-[var(--color-border-soft)] rounded-lg px-4 py-3 text-xs text-[var(--color-text-faint)] leading-relaxed">
          <p className="text-[var(--color-text-muted)] font-medium mb-1">Demo accounts</p>
          Dispatcher — dispatcher@fleet.com / dispatch123
          <br />
          Admin — admin@fleet.com / admin123
          <br />
          Manager — manager@fleet.com / manager123
        </div>
      </div>
    </div>
  );
}
