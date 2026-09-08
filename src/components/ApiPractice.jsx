import { useEffect, useState } from "react";
export function ApiPractice(){
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [submitting,setSubmitting] = useState(false);
    const [successMessage,setSuccessMessage] = useState("");
    async function handleSubmit(e){
        e.preventDefault();
        setSubmitting(true);
        /*the url ia an api endpoint that accepts post request and returns a response ,
        the method describes the type of request being made,
        the headers specify the content type of the request body specifically that it is in json format which helps the server understand how to parse the incoming data,
        the body contains the actual data being sent to the server in this case the title and description of a post which is converted to a json string using json.stringify()*/
        try{
        const response = await fetch('http://localhost:5000/api/events',{
            method:"post",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                title,description
            })
        });
        console.log(response.status);
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result);
        setTitle("");
        setDescription("");
        setSuccessMessage("Post submitted successfully!");

    }
    catch (error){
        setError(error.message);
    }
    finally{
        setSubmitting(false);
    }
}
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/events');
                if(!response.ok){
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result);
                setLoading(false);
                setError(null);
            }
            catch (error){
                setError(error.message);
                setLoading(false);
            }
        }
        fetchData();
    },[]);
   
    return (
        <>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (<div>{data.map(post => <p key={post.id}>{post.title}</p>)}</div>)}
        <form onSubmit={handleSubmit}>
            <label>
            <input
            name="title"
            type="text"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />Title
            </label>
            <label>
            <input
            name="description"
            type="text"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            />Description
            </label>
            <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
            </button>
        </form>
        </>
    )
    
}