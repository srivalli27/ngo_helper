import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Compass } from "lucide-react";

export function ProtectedRoute({ children, allowedRole }) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="events-page" style={{ textAlign: "center", padding: "80px 24px" }}>
                <Compass size={36} color="var(--color-primary)" style={{ animation: "spin 2s linear infinite" }} />
                <p style={{ marginTop: "16px", color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
                    Verifying authentication & role...
                </p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role && role !== allowedRole) {
        return <Navigate to={role === "ngo" ? "/ngo-dashboard" : "/volunteer-dashboard"} replace />;
    }

    return children;
}
