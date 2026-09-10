import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, ArrowLeft } from "lucide-react";

export function CreateEvent() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        location: "Hyderabad",
        date: "",
        category: "Education",
        spots: 10,
        description: ""
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.title || !formData.date || !formData.spots || !formData.description) {
            setError("Please fill in all required event details");
            return;
        }

        if (parseInt(formData.spots, 10) <= 0) {
            setError("Volunteer spots needed must be at least 1");
            return;
        }

        setError("");
        setLoading(true);

        try {
            if (user) {
                const { error: insertError } = await supabase
                    .from("events")
                    .insert({
                        ngo_id: user.id,
                        title: formData.title,
                        location: formData.location,
                        date: formData.date,
                        category: formData.category,
                        spots: parseInt(formData.spots, 10),
                        description: formData.description
                    });

                if (insertError) {
                    throw insertError;
                }
            }

            navigate("/ngo-dashboard");
        } catch (err) {
            console.error("CREATE EVENT ERROR:", err);
            setError(err.message || "Failed to create event. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="events-page" style={{ maxWidth: "720px" }}>
            <div className="page-header">
                <div>
                    <h1>Post a <em>New Drive.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Specify event location, date, category, and required volunteer spots</p>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="auth-card" style={{ padding: "32px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Weekend Tree Plantation Drive"
                            required
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>City / Location *</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Pune">Pune</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Event Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Education">Education</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Environment">Environment</option>
                                <option value="Animals">Animals</option>
                                <option value="Food">Food</option>
                                <option value="Community">Community</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Volunteers Needed (Spots) *</label>
                            <input
                                type="number"
                                name="spots"
                                value={formData.spots}
                                onChange={handleChange}
                                min={1}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Event Description & Volunteer Instructions *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe what volunteers will be doing, reporting time, and any materials provided..."
                            required
                        />
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/ngo-dashboard")}
                            style={{ flex: 1 }}
                        >
                            <ArrowLeft size={16} /> Cancel
                        </button>
                        <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
                            <PlusCircle size={16} /> {loading ? "Publishing..." : "Publish Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
