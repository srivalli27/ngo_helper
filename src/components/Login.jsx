import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

export function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

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

            console.log("Logged in user:", user.id);

            const { data: roleData, error: roleError } = await supabase
                .from("user_roles")
                .select("role")
                .eq("id", user.id)
                .single();

            if (roleError) {
                throw roleError;
            }

            console.log("User role:", roleData.role);

            if (roleData.role === "volunteer") {
                navigate("/volunteer-dashboard");
            } else if (roleData.role === "ngo") {
                navigate("/ngo-dashboard");
            }

        } catch (error) {
            console.error("LOGIN ERROR:", error);
            setError(error.message);
        }
    }

    return (
        <div className="login-page">
            <h1>Login</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}