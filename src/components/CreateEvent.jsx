import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
export function CreateEvent( {onCreate, successMessage}){
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        title:"",
        location:"",
        date:"",
        ngo:"",
        category:"",
        spots:0,
        description:""
    });
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    function handleSubmit(e){
        e.preventDefault();
        if(formData.date<new Date().toISOString().split('T')[0]){
            alert("Date cannot be in the past");
            return;
        }
        if(formData.spots<=0){
            alert("Spots should be greater than 0");
            return;
        }
        const eventData = {
            title: formData.title,
            location: formData.location,
            date: formData.date,
            ngo: formData.ngo,
            category: formData.category,
            spots: formData.spots,
            description: formData.description
        };
        onCreate(eventData);
        setFormData({
            title:"",
            location:"",
            date:"",
            ngo:"",
            category:"",
            spots:0,
            description:""
        });
    }
    return(
        <>
            <form className="create-event-form" onSubmit={handleSubmit}>
                <h1>Create Event</h1>
                <label >Title
                    <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                /></label>
                <label>NGO
                    <input
                    type="text"
                    name="ngo"
                    value={formData.ngo}
                    onChange={handleChange}
                    required
                />
                </label>
                <label>Location
                    <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                </label>
                <label>Date
                    <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                /></label>
                <label>Category
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required>
                    <option value="">Select Category</option>
                    <option value="Education">Education</option>
                    <option value="Animals">Animals</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Community">Community</option>
                    <option value="Food">Food</option>
                </select>
                </label>
               

                
                <label>Spots
                    <input
                        type="number"
                        name="spots"
                        value={formData.spots}
                        onChange={handleChange}
                        required
                    />

                </label>
                <label>Description
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Create</button>
                {successMessage && <p className="success-message">{successMessage} </p>}
                <button onClick={() => navigate("/events")}>Go to Events</button>
            </form>
        </>
    )
}