import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { User, Check, X, Award, Calendar, RefreshCw } from "lucide-react";

export default function Applicants() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [pastWork, setPastWork] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function fetchApplicants() {
        if (!user) return;
        setLoading(true);
        setError("");

        try {
            // Query applications for events hosted by this NGO
            const { data, error: appError } = await supabase
                .from("applications")
                .select(`
                    id,
                    status,
                    volunteer_id,
                    created_at,
                    events!inner(id, title, date, location, spots, ngo_id),
                    volunteer_profiles(full_name, location, skills, interests, availability, bio, phone)
                `)
                .eq("events.ngo_id", user.id)
                .neq("status", "cancelled")
                .order("created_at", { ascending: false });

            if (appError) {
                console.error("APPLICANTS QUERY ERROR:", appError);
                setError(appError.message);
                setLoading(false);
                return;
            }

            const apps = data || [];
            setApplications(apps);

            // Fetch past work history for all applicants
            const volunteerIds = [...new Set(apps.map((item) => item.volunteer_id))];

            if (volunteerIds.length > 0) {
                const { data: history, error: historyError } = await supabase
                    .from("applications")
                    .select("volunteer_id, status, events(title, date, category)")
                    .in("volunteer_id", volunteerIds)
                    .in("status", ["accepted", "completed"]);

                if (!historyError && history) {
                    const grouped = {};
                    history.forEach((item) => {
                        if (!grouped[item.volunteer_id]) {
                            grouped[item.volunteer_id] = [];
                        }
                        grouped[item.volunteer_id].push(item);
                    });
                    setPastWork(grouped);
                }
            }
        } catch (err) {
            console.error("FETCH ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApplicants();
    }, [user]);

    async function handleDecision(application, newStatus) {
        setError("");

        if (newStatus === "accepted") {
            const acceptedCount = applications.filter(
                (item) =>
                    item.events?.id === application.events?.id &&
                    item.status === "accepted"
            ).length;

            if (acceptedCount >= application.events.spots) {
                setError(`Cannot accept: All ${application.events.spots} spots for "${application.events.title}" are full.`);
                return;
            }
        }

        try {
            const { error: updateError } = await supabase
                .from("applications")
                .update({ status: newStatus })
                .eq("id", application.id);

            if (updateError) {
                console.error("UPDATE ERROR:", updateError);
                setError(`Failed to update application: ${updateError.message}`);
                return;
            }

            // Immediately update local state so UI reflects the decision
            setApplications((prevApps) =>
                prevApps.map((item) =>
                    item.id === application.id ? { ...item, status: newStatus } : item
                )
            );
        } catch (err) {
            console.error("DECISION EXCEPTION:", err);
            setError(err.message);
        }
    }

    if (loading) {
        return (
            <div className="events-page" style={{ textAlign: "center", padding: "60px 24px" }}>
                <p style={{ color: "var(--color-text-muted)" }}>Loading volunteer applications...</p>
            </div>
        );
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Volunteer <em>Applicants.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Review volunteer details and past contributions to approve or decline</p>
                </div>
                <button type="button" className="btn-secondary btn-sm" onClick={fetchApplicants}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            {applications.length === 0 ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <User size={36} color="var(--color-text-light)" style={{ marginBottom: "12px" }} />
                    <h3>No volunteer applications yet</h3>
                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>
                        Applications will appear here as volunteers discover and apply for your posted drives.
                    </p>
                </div>
            ) : (
                <div className="applicant-grid">
                    {applications.map((application) => {
                        const volunteer = application.volunteer_profiles || {};
                        const historyList = pastWork[application.volunteer_id] || [];

                        return (
                            <div className="applicant-card" key={application.id}>
                                <div className="applicant-card-header">
                                    <div>
                                        <div className="applicant-name">{volunteer.full_name || "Volunteer Candidate"}</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                                            <Calendar size={13} /> Applied for: <strong>{application.events?.title}</strong> ({application.events?.date})
                                        </div>
                                    </div>
                                    <span className={`status-pill ${application.status}`}>
                                        <span className="user-role-dot"></span> {application.status}
                                    </span>
                                </div>

                                {/* Detail Grid */}
                                <div className="applicant-details-grid">
                                    <div className="applicant-detail-item">
                                        <label>Location</label>
                                        <span>{volunteer.location || "-"}</span>
                                    </div>
                                    <div className="applicant-detail-item">
                                        <label>Availability</label>
                                        <span>{volunteer.availability || "-"}</span>
                                    </div>
                                    <div className="applicant-detail-item">
                                        <label>Contact Phone</label>
                                        <span>{volunteer.phone || "-"}</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "12px" }}>
                                    <strong style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Skills:</strong>
                                    <div className="tag-list">
                                        {(volunteer.skills || []).length > 0 ? (
                                            (volunteer.skills || []).map((skill, idx) => (
                                                <span className="tag-pill" key={idx}>{skill}</span>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>None listed</span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: "12px" }}>
                                    <strong style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Interests:</strong>
                                    <div className="tag-list">
                                        {(volunteer.interests || []).length > 0 ? (
                                            (volunteer.interests || []).map((interest, idx) => (
                                                <span className="tag-pill" key={idx} style={{ background: "var(--bg-mint)" }}>{interest}</span>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>None listed</span>
                                        )}
                                    </div>
                                </div>

                                {volunteer.bio && (
                                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "16px", fontStyle: "italic", background: "#FFFFFF", padding: "10px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}>
                                        "{volunteer.bio}"
                                    </p>
                                )}

                                {/* PAST WORK HISTORY BOX */}
                                <div className="past-work-box">
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                        <Award size={14} color="var(--color-mint-text)" />
                                        <h5 style={{ margin: 0 }}>Volunteer Past Work & Participation ({historyList.length})</h5>
                                    </div>
                                    {historyList.length === 0 ? (
                                        <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>No past accepted events recorded yet.</p>
                                    ) : (
                                        <ul className="past-work-list">
                                            {historyList.map((item, index) => (
                                                <li key={index}>
                                                    <span style={{ color: "var(--color-mint-text)" }}>✓</span>
                                                    <strong>{item.events?.title}</strong> — {item.events?.date} ({item.status})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* ACTION BUTTONS */}
                                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                                    {application.status !== "accepted" && (
                                        <button
                                            type="button"
                                            className="btn-primary btn-sm"
                                            onClick={() => handleDecision(application, "accepted")}
                                            style={{ flex: 1 }}
                                        >
                                            <Check size={14} /> Accept Candidate
                                        </button>
                                    )}
                                    {application.status !== "rejected" && (
                                        <button
                                            type="button"
                                            className="btn-secondary btn-sm"
                                            onClick={() => handleDecision(application, "rejected")}
                                            style={{ flex: 1, color: "#B91C1C", borderColor: "#FECACA" }}
                                        >
                                            <X size={14} /> Decline Application
                                        </button>
                                    )}
                                    {application.status === "accepted" && (
                                        <button
                                            type="button"
                                            className="btn-secondary btn-sm"
                                            onClick={() => handleDecision(application, "completed")}
                                        >
                                            Mark Drive Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
