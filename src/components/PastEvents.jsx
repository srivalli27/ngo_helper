import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin, Award } from "lucide-react";

export default function PastEvents() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplications() {
            if (!user) return;
            setLoading(true);
            setError("");

            try {
                const today = new Date().toISOString().split("T")[0];

                const { data, error: fetchErr } = await supabase
                    .from("applications")
                    .select("id, status, events(title, location, date, category, ngo_profiles(organization_name))")
                    .eq("volunteer_id", user.id)
                    .in("status", ["accepted", "completed"]);

                if (fetchErr) {
                    console.error("PAST EVENTS ERROR:", fetchErr);
                    setError(fetchErr.message);
                    setLoading(false);
                    return;
                }

                const pastApps = (data || []).filter(
                    (application) => application.events && application.events.date < today
                );

                setApplications(pastApps);
            } catch (err) {
                console.error("EXCEPTION:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchApplications();
    }, [user]);

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Past <em>Work & History.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Completed volunteer drives and impact record</p>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            {loading ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <p style={{ color: "var(--color-text-muted)" }}>Loading history...</p>
                </div>
            ) : applications.length === 0 ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <Award size={32} color="var(--color-text-light)" style={{ marginBottom: "12px" }} />
                    <h3>No completed drives yet</h3>
                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>Participate in upcoming events to build your volunteer history.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Event Title</th>
                                <th>NGO Organization</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Completion Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application.id}>
                                    <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>
                                        {application.events?.title}
                                    </td>
                                    <td>{application.events?.ngo_profiles?.organization_name || "NGO Partner"}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <MapPin size={13} color="var(--color-primary)" />
                                            {application.events?.location}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Calendar size={13} />
                                            {application.events?.date}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tag-pill">{application.events?.category}</span>
                                    </td>
                                    <td>
                                        <span className="status-pill completed">
                                            <Award size={13} /> Completed
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
