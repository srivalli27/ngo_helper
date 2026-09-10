import { Calendar, MapPin, Tag, CheckCircle2 } from "lucide-react";

export default function EventRow({ event, onApply, isApplied }) {
    const ngoName = event.ngo_profiles?.organization_name || "Community Partner";
    const spotsRemaining = typeof event.remaining === "number" ? event.remaining : event.spots;
    const isFull = spotsRemaining <= 0;

    return (
        <tr>
            <td>
                <div style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "0.95rem" }}>
                    {event.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                    {event.description}
                </div>
            </td>
            <td>
                <div style={{ fontWeight: 600, color: "var(--color-text-main)" }}>
                    {ngoName}
                </div>
            </td>
            <td>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                    <MapPin size={13} color="var(--color-primary)" />
                    {event.location}
                </div>
            </td>
            <td>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                    <Calendar size={13} />
                    {event.date}
                </div>
            </td>
            <td>
                <span className="tag-pill">
                    {event.category}
                </span>
            </td>
            <td>
                <span className="spot-badge">
                    {event.spots} spots
                </span>
            </td>
            <td>
                <span className={`spot-badge ${isFull ? "status-rejected" : ""}`} style={{ background: isFull ? "#FEF2F2" : "var(--bg-mint)", color: isFull ? "#991B1B" : "var(--color-mint-text)" }}>
                    {isFull ? "Full" : `${spotsRemaining} left`}
                </span>
            </td>
            <td style={{ textAlign: "right" }}>
                {isApplied ? (
                    <span className="status-pill applied">
                        <CheckCircle2 size={13} /> Applied
                    </span>
                ) : isFull ? (
                    <button type="button" className="btn-secondary btn-sm" disabled style={{ opacity: 0.5 }}>
                        Full
                    </button>
                ) : (
                    <button type="button" className="btn-primary btn-sm" onClick={() => onApply(event)}>
                        Apply Now
                    </button>
                )}
            </td>
        </tr>
    );
}
