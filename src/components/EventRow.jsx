function EventRow({ event,onApply,isApplied }) {
    
    return (
        <>
        <tr>
            <td>{event.id}</td>
            <td>{event.title}</td>
            <td>{event.ngo}</td>
            <td>{event.location}</td>
            <td>{event.date}</td>
            <td>{event.category}</td>
            <td>{event.spots}</td>
            <td>{event.description}</td>
            <td>
                <button onClick={() =>onApply(event)}>
                    {isApplied ? 'Applied': 'Apply'}
                </button>
            </td>
        </tr>
        </>
    )
}
export default EventRow;