import { useState } from 'react';
export function Register(){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [role,setRole] = useState("");
    const handleChange=(e)=>{
        setRole(e.target.value)
    }
    function handleSubmit(e){
        e.preventDefault();
        if(!name || !email || !password || !confirmPassword || !role){
            console.log("All fields are necessary");
            return;
        }
        if(password!==confirmPassword){
            console.log("Password and ConfirmPassword should be same");
            return;
        }
        const userData={
            name,email,password,role
        }
        console.log(userData);

    }
    return(
        <>
        <h3>Register</h3>
        <form onSubmit={ handleSubmit }>
            <label>Name
                <input
                type="name"
                name="name"
                value={name}
                onChange={(e=>setName(e.target.value))}
                />
            </label>
            <label> Email
                <input 
                type="email" 
                name="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required/>
               
            </label>
        
            <label>Password
                <input 
                type="password" 
                name="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
                
            </label>
            
            <label> Confirm Password
                <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                required
                />
               
            </label>
            
            <p>Role</p>
            <label>
                <input
                type="radio"
                name="role"
                value="Volunteer"
                checked={role === "volunteer"}
                onChange={handleChange}
                />
                Volunteer
            
            
                <input
                type="radio"
                name="role"
                value="ngo"
                checked={role === "ngo"}
                onChange={handleChange}
                />
                NGO
            </label>
            <button type="submit">Register</button>

        </form>
        </>
    )
}