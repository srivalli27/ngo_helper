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

export default function NgoProfile() {
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        organization_name: "",
        contact_person: "",
        phone: "",
        location: "",
        organization_type: "",
        causes: "",
        website: "",
        description: ""
    });

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;

            const { data, error: profileErr } = await supabase
                .from("ngo_profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();

            if (profileErr) {
                console.error("PROFILE ERROR:", profileErr);
            }

            if (data) {
                setFormData({
                    organization_name: data.organization_name || "",
                    contact_person: data.contact_person || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    organization_type: data.organization_type || "Nonprofit",
                    causes: (data.causes || []).join(", "),
                    website: data.website || "",
                    description: data.description || ""
                });
            } else {
                setFormData((prev) => ({
                    ...prev,
                    organization_name: user.user_metadata?.name || ""
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
                .from("ngo_profiles")
                .upsert({
                    id: user.id,
                    organization_name: formData.organization_name,
                    contact_person: formData.contact_person,
                    phone: formData.phone,
                    location: formData.location,
                    organization_type: formData.organization_type,
                    causes: toArray(formData.causes),
                    website: formData.website,
                    description: formData.description
                });

            if (upsertErr) {
                setError(upsertErr.message);
                setLoading(false);
                return;
            }
        }

        setSuccessMessage("Organization profile updated successfully!");
        setLoading(false);
        setTimeout(() => setSuccessMessage(""), 4000);
    }

    return (
        <div className="events-page" style={{ maxWidth: "720px" }}>
            <div className="page-header">
                <div>
                    <h1>Organization <em>Profile.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Update contact information, focus causes, and organization website</p>
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
                        <label>Organization Name *</label>
                        <input
                            type="text"
                            name="organization_name"
                            value={formData.organization_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>Contact Person</label>
                            <input
                                type="text"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                placeholder="e.g. Dr. Sunita Rao"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98123 45678"
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>Primary Location *</label>
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

                        <div className="form-group">
                            <label>Organization Type</label>
                            <select
                                name="organization_type"
                                value={formData.organization_type}
                                onChange={handleChange}
                            >
                                <option value="Nonprofit">Nonprofit</option>
                                <option value="Trust">Trust</option>
                                <option value="Foundation">Foundation</option>
                                <option value="Community Group">Community Group</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Causes / Focus Areas (comma separated)</label>
                        <input
                            type="text"
                            name="causes"
                            value={formData.causes}
                            onChange={handleChange}
                            placeholder="Education, Healthcare, Environment"
                        />
                    </div>

                    <div className="form-group">
                        <label>Website URL</label>
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://organization.org"
                        />
                    </div>

                    <div className="form-group">
                        <label>Organization Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe your organization's mission..."
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "12px" }} disabled={loading}>
                        <Save size={16} /> {loading ? "Saving..." : "Save Organization Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}
