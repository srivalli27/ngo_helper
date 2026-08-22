import { useState } from 'react';
import { Navbar } from './Navbar.jsx';
export function Login(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    async function handleSubmit(e){
        e.preventDefault();
        if(!email || !password) {
            console.log("Both fields are empty");
            return;
        }
        const response = await fetch('https://jsonplaceholder.typicode.com/posts',
            {
                method:"post",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    email,password
                })
            }
        );
        const data = await response.json();
        console.log(data);

    }
    return(
        <>
        <Navbar/>
        <b>Welcome to NGO helper</b>
        <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input 
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <button type="submit" >Login</button>
        </form>
        <p>Do not have an Account?
            <button className="Register">Register</button>
        </p>
        </>
    )
}