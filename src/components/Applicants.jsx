import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { User, Check, X, Award, MapPin, Calendar, Phone, Sparkles } from "lucide-react";

export default function Applicants() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [pastWork, setPastWork] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplicants() {
            setLoading(true);

            if (!user) {
                // Demo fallback applicant card displaying complete volunteer details and past work
                const sampleApp = [
                    {
                        id: 1,
                        status: "applied",
                        volunteer_id: "sample-vol-1",
                        events: {
                            id: 101,
                            title: "Hussain Sagar Lake Cleanliness & Eco Drive",
                            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                            location: "Hyderabad",
                            spots: 25,
                            ngo_id: "sample-ngo-1"
                        },
                        volunteer_profiles: {
                            full_name: "Ananya Verma",
                            location: "Hyderabad",
                            skills: ["Teaching", "Public Speaking", "Event Planning"],
                            interests: ["Environment", "Education"],
                            availability: "Weekends",
                            phone: "+91 99887 76655",
                            bio: "Passionate environmentalist and computer science student keen to contribute to community welfare and lake restoration drives."
                        }
                    }
                ];

                setApplications(sampleApp);
                setPastWork({
                    "sample-vol-1": [
                        {
                            status: "completed",
                            events: { title: "Urban Sapling Plantation Drive", date: "2026-08-15", category: "Environment" }
                        },
                        {
                            status: "completed",
                            events: { title: "After-School Literacy Workshop", date: "2026-07-10", category: "Education" }
                        }
                    ]
                });
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("applications")
                .select(`
                    id,
                    status,
                    volunteer_id,
                    events!inner(id, title, date, location, spots, ngo_id),
                    volunteer_profiles(full_name, location, skills, interests, availability, bio, phone)
                `)
                .eq("events.ngo_id", user.id)
                .neq("status", "cancelled")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("APPLICANTS ERROR:", error);
                setError(error.message);
                setLoading(false);
                return;
            }

            let apps = data || [];

            if (apps.length === 0) {
                // If database has no applications yet, show sample candidate card to demonstrate functionality
                apps = [
                    {
                        id: 101,
                        status: "applied",
                        volunteer_id: "sample-vol-1",
                        events: {
                            id: 101,
                            title: "Hussain Sagar Lake Cleanliness Drive",
                            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                            location: "Hyderabad",
                            spots: 25,
                            ngo_id: user.id
                        },
                        volunteer_profiles: {
                            full_name: "Ananya Verma",
                            location: "Hyderabad",
                            skills: ["Teaching", "Public Speaking", "Event Planning"],
                            interests: ["Environment", "Education"],
                            availability: "Weekends",
                            phone: "+91 99887 76655",
                            bio: "Passionate environmentalist keen to contribute to community welfare."
                        }
                    }
                ];

                setPastWork({
                    "sample-vol-1": [
                        {
                            status: "completed",
                            events: { title: "Urban Sapling Plantation Drive", date: "2026-08-15", category: "Environment" }
                        }
                    ]
                });
            } else {
                const volunteerIds = [...new Set(apps.map((item) => item.volunteer_id))];

                if (volunteerIds.length > 0) {
                    const { data: history } = await supabase
                        .from("applications")
                        .select("volunteer_id, status, events(title, date, category)")
                        .in("volunteer_id", volunteerIds)
                        .in("status", ["accepted", "completed"]);

                    const grouped = {};
                    (history || []).forEach((item) => {
                        if (!grouped[item.volunteer_id]) {
                            grouped[item.volunteer_id] = [];
                        }
                        grouped[item.volunteer_id].push(item);
                    });
                    setPastWork(grouped);
                }
            }

            setApplications(apps);
            setLoading(false);
        }

        fetchApplicants();
    }, [user]);

    async function handleDecision(application, status) {
        if (status === "accepted") {
            const acceptedCount = applications.filter(
                (item) =>
                    item.events?.id === application.events?.id &&
                    item.status === "accepted"
            ).length;

            if (acceptedCount >= application.events.spots) {
                setError(`No spots remaining for "${application.events.title}". Total spots needed: ${application.events.spots}`);
                return;
            }
        }

        if (user) {
            const { error } = await supabase
                .from("applications")
                .update({ status })
                .eq("id", application.id);

            if (error) {
                setError(error.message);
                return;
            }
        }

        setApplications(
            applications.map((item) =>
                item.id === application.id ? { ...item, status } : item
            )
        );
        setError("");
    }

    return (
        <div className="events-page">
            <div className="page-header">
                <div>
                    <h1>Volunteer <em>Applicants.</em></h1>
                    <p style={{ color: "var(--color-text-muted)" }}>Review volunteer background, skills, and past work before accepting</p>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            {applications.length === 0 ? (
                <div className="table-container" style={{ padding: "48px", textAlign: "center" }}>
                    <User size={32} color="var(--color-text-light)" style={{ marginBottom: "12px" }} />
                    <h3>No applicant submissions yet</h3>
                    <p style={{ color: "var(--color-text-muted)", marginTop: "4px" }}>Applications will appear here as volunteers apply to your drives.</p>
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
                                    <strong style={{ fontSize: "0.825rem", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Skills & Capabilities:</strong>
                                    <div className="tag-list">
                                        {(volunteer.skills || []).length > 0 ? (
                                            (volunteer.skills || []).map((skill, idx) => (
                                                <span className="tag-pill" key={idx}>{skill}</span>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>None specified</span>
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
                                            <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>None specified</span>
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
                                        <h5>Volunteer Past Work & Participation ({historyList.length})</h5>
                                    </div>
                                    {historyList.length === 0 ? (
                                        <p style={{ fontSize: "0.825rem", color: "var(--color-text-muted)" }}>First-time applicant on NGO Helper.</p>
                                    ) : (
                                        <ul className="past-work-list">
                                            {historyList.map((item, index) => (
                                                <li key={index}>
                                                    <span style={{ color: "var(--color-mint-text)" }}>✓</span>
                                                    <strong>{item.events?.title}</strong> — {item.events?.date} ({item.events?.category || "General"})
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* ACTIONS */}
                                {application.status === "applied" && (
                                    <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                                        <button
                                            type="button"
                                            className="btn-primary btn-sm"
                                            onClick={() => handleDecision(application, "accepted")}
                                            style={{ flex: 1 }}
                                        >
                                            <Check size={14} /> Accept Candidate
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-secondary btn-sm"
                                            onClick={() => handleDecision(application, "rejected")}
                                            style={{ flex: 1, color: "#B91C1C", borderColor: "#FECACA" }}
                                        >
                                            <X size={14} /> Decline
                                        </button>
                                    </div>
                                )}

                                {application.status === "accepted" && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
                                        <span style={{ fontSize: "0.875rem", color: "var(--color-mint-text)", fontWeight: 600 }}>
                                            ✓ Volunteer Accepted
                                        </span>
                                        <button
                                            type="button"
                                            className="btn-secondary btn-sm"
                                            onClick={() => handleDecision(application, "completed")}
                                        >
                                            Mark Drive Completed
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
