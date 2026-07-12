import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login(){

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const navigate = useNavigate();

   async function handleSubmit(event){
        event.preventDefault();
        try {
            const response = await api.post("login/",{
                username:username,//json data we send
                password:password
            })
            localStorage.setItem("access",response.data.access);
            localStorage.setItem("refresh",response.data.refresh);
            console.log('Login Successful');
            navigate("/task");
               
        } catch (error) {
            console.log(error);
            
        }
        }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold">
                        Login
                </h1>
                <form onSubmit={handleSubmit}>

                <input
                type="text" 
                placeholder="UserName"
                className="mb-4 w-full rounded-md border p-3"
                onChange={(e) => setUsername(e.target.value)} //"When the input changes, take the current value from the input and save it into username."
                value={username}
                />
                <input
                type="password"
                placeholder="Password"
                className="mb-4 w-full rounded-md border p-3"
                onChange={(e)=> setPassword(e.target.value)}
                value={password}
                />
                <button className="w-full rounded-md p-3 bg-blue-600 text-white hover:bg-blue-700"
                type="submit">
                    Login
                </button>
                </form>
            </div>

        </div>
    );
}

// You type in the username → onChange updates username.
// You type in the password → onChange updates password.
// You click Login (or press Enter).
// Since the button has type="submit", the form is submitted.
// onSubmit={handleLogin} calls handleLogin().
// event.preventDefault() stops the page from refreshing.   
// username and password are available inside handleLogin.


// React
// ↓

// Send Login Request

// ↓

// Django

// ↓

// Checks username/password

// ↓

// Returns data

// ↓

// response
