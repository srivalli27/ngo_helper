import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Email and password are required");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password
            });

            if (error) {
                throw error;
            }

            const user = data.user;

            if (!user) {
                throw new Error("Login failed");
            }

            const { data: roleData, error: roleError } = await supabase
                .from("user_roles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (roleError) {
                // If role query fails or role missing, fallback to volunteer dashboard default or metadata role
                const metaRole = user.user_metadata?.role || "volunteer";
                if (metaRole === "ngo") {
                    navigate("/ngo-dashboard");
                } else {
                    navigate("/volunteer-dashboard");
                }
                return;
            }

            if (roleData?.role === "ngo") {
                navigate("/ngo-dashboard");
            } else {
                navigate("/volunteer-dashboard");
            }

        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome <em>back.</em></h1>
                    <p>Log in to access your dashboard and active events</p>
                </div>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "12px" }} disabled={loading}>
                        {loading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account yet? <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
}
