import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, Clock, XCircle, MapPin, Calendar } from "lucide-react";

export default function AppliedEvents() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplications() {
            setLoading(true);

            if (!user) {
                // Demo fallback
                setApplications([
                    {
                        id: 1,
                        status: "accepted",
                        events: {
                            title: "Hussain Sagar Lake Cleanliness Drive",
                            location: "Hyderabad",
                            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                            category: "Environment",
                            ngo_profiles: { organization_name: "Green Earth Foundation" }
                        }
                    },
                    {
                        id: 2,
                        status: "applied",
                        events: {
                            title: "Free Eye Screening Camp",
                            location: "Bangalore",
                            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                            category: "Healthcare",
                            ngo_profiles: { organization_name: "Hope Healthcare Trust" }
                        }
                    }
                ]);
                setLoading(false);
                return;
            }

            const today = new Date().toISOString().split("T")[0];

            const { data, error } = await supabase
                .from("applications")
                .select("id, status, events(title, location, date, category, ngo_profiles(organization_name))")
                .eq("volunteer_id", user.id)
                .neq("status", "cancelled");

            if (error) {
                console.error("APPLICATION ERROR:", error);
                setError(error.message);
                setLoading(false);
                return;
            }

            const activeApps = (data || []).filter(
                (application) => application.events && application.events.date >= today
            );

            if (activeApps.length === 0) {
                // If user has no active DB apps yet, provide initial sample display
                setApplications([
                    {
                        id: 101,
                        status: "accepted",
                        events: {
                            title: "Hussain Sagar Lake Cleanliness Drive",
                            location: "Hyderabad",
                            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                            category: "Environment",
                            ngo_profiles: { organization_name: "Green Earth Foundation" }
                        }
                    }
                ]);
            } else {
                setApplications(activeApps);
            }

            setLoading(false);
        }

        fetchApplications();
    }, [user]);

    async function handleCancel(application) {
        if (user) {
            const { error } = await supabase
                .from("applications")
                .update({ status: "cancelled" })
                .eq("id", application.id);

            if (error) {
                setError(error.message);
                return;
            }
        }

        setApplications(applications.filter((item) => item.id !== application.id));
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Applied <em>Events.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Track active applications and accepted NGO drive statuses</p>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            {applications.length === 0 ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <Clock size={32} color="var(--color-text-light)" style={{ marginBottom: "12px" }} />
                    <h3>No active applications</h3>
                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>Browse available opportunities to apply!</p>
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
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Action</th>
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
                                        <span className={`status-pill ${application.status}`}>
                                            <span className="user-role-dot"></span>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {application.status === "applied" && (
                                            <button
                                                type="button"
                                                className="btn-secondary btn-sm"
                                                onClick={() => handleCancel(application)}
                                                style={{ color: "#B91C1C", borderColor: "#FECACA" }}
                                            >
                                                Cancel Application
                                            </button>
                                        )}
                                        {application.status === "accepted" && (
                                            <span style={{ fontSize: "0.85rem", color: "var(--color-mint-text)", fontWeight: 600 }}>
                                                Confirmed Spot ✓
                                            </span>
                                        )}
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
