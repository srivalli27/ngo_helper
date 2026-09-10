import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Save, CheckCircle2 } from "lucide-react";

function toArray(value) {
    if (Array.isArray(value)) return value;
    return (value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export default function VolunteerProfile() {
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        location: "",
        bio: "",
        skills: "",
        interests: "",
        availability: ""
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;

            const { data, error: profileErr } = await supabase
                .from("volunteer_profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (profileErr) {
                console.error("PROFILE FETCH ERROR:", profileErr);
            }

            if (data) {
                setFormData({
                    full_name: data.full_name || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    bio: data.bio || "",
                    skills: (data.skills || []).join(", "),
                    interests: (data.interests || []).join(", "),
                    availability: data.availability || ""
                });
            } else {
                // If profile row doesn't exist yet, prefill full name from user metadata
                setFormData((prev) => ({
                    ...prev,
                    full_name: user.user_metadata?.name || ""
                }));
            }
        }

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        if (user) {
            const { error: upsertErr } = await supabase
                .from("volunteer_profiles")
                .upsert({
                    id: user.id,
                    full_name: formData.full_name,
                    phone: formData.phone,
                    location: formData.location,
                    bio: formData.bio,
                    skills: toArray(formData.skills),
                    interests: toArray(formData.interests),
                    availability: formData.availability
                });

            if (upsertErr) {
                setError(upsertErr.message);
                setLoading(false);
                return;
            }
        }

        setSuccessMessage("Profile preferences updated successfully!");
        setLoading(false);
        setTimeout(() => setSuccessMessage(""), 4000);
    }

    return (
        <div className="events-page" style={{ maxWidth: "720px" }}>
            <div className="page-header">
                <div>
                    <h1>Volunteer <em>Profile.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Update your city location, availability, and skills</p>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}
            {successMessage && (
                <div className="form-success" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={16} /> {successMessage}
                </div>
            )}

            <div className="auth-card" style={{ padding: "32px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div className="form-group">
                            <label>City / Location *</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Location</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Pune">Pune</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Availability Schedule *</label>
                        <select
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Availability</option>
                            <option value="Weekdays">Weekdays</option>
                            <option value="Weekends">Weekends</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Interests & Causes (comma separated)</label>
                        <input
                            type="text"
                            name="interests"
                            value={formData.interests}
                            onChange={handleChange}
                            placeholder="Environment, Education, Healthcare"
                        />
                    </div>

                    <div className="form-group">
                        <label>Skills & Capabilities (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Teaching, First Aid, Photography, Event Planning"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio / Background</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Share your experience or motivation for volunteering..."
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "12px" }} disabled={loading}>
                        <Save size={16} /> {loading ? "Saving..." : "Save Profile Details"}
                    </button>
                </form>
            </div>
        </div>
    );
}
