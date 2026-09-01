import {useState} from 'react';
export function CreateEvent(){
    const [title,setTitle] = useState("");
    const [location,setLocation] = useState("");
    const [date,setDate] = useState("");
    function handleSubmit(e){
        e.preventDefault();
        if(!title || !location || !date){
            alert("All fields are necessary");
            return;
        }
        const eventData = {
            title,
            location,
            date
        };
        console.log(eventData);
    }
    return(
        <>
            <form className="create-event-form" onSubmit={handleSubmit}>
                <h1>Create Event</h1>
                <label >Title
                    <input
                type="text"
                name="title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                /></label>

                <label >Location
                    <input
                        type="text"
                        name="location"
                        value={location}
                        onChange={(e)=>setLocation(e.target.value)}
                    />
                </label>

                <label >Date
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e)=>setDate(e.target.value)}
                    />
                </label>
                <button type="submit">Create</button>
            </form>
        </>
    )
}