import { useState } from 'react';
export function Register(){
    /*const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [role,setRole] = useState("");*/
    const [error,setError] = useState("")
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        role:"",
    });
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    function handleSubmit(e){
        e.preventDefault();
        if(!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role){
            setError("All fields are necessary");
            return;
        }
        if(formData.password!==formData.confirmPassword){
            setError("Password and ConfirmPassword should be same");
            return;
        }
       setError("")
        const userData=formData
        console.log(userData);

    }
    return(
        <>
        <h3>Register</h3>
        <form onSubmit={ handleSubmit }>
        {error && <p>{error}</p>}
            <label>Name
                <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                />
            </label>
            <label> Email
                <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required/>
               
            </label>
        
            <label>Password
                <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                />
                
            </label>
            
            <label> Confirm Password
                <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                />
               
            </label>
            
            <p>Role</p>
            <label>
                <input
                type="radio"
                name="role"
                value="volunteer"
                checked={formData.role === "volunteer"}
                onChange={handleChange}
                />
                Volunteer
            
            
                <input
                type="radio"
                name="role"
                value="ngo"
                checked={formData.role === "ngo"}
                onChange={handleChange}
                />
                NGO
            </label>
            <button type="submit">Register</button>

        </form>
        </>
    )
}