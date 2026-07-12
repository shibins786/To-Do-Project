    import { useState } from "react";
    import { Link,useNavigate } from "react-router-dom"; // Used to navigate without refreshing the page.
    import api from "../api/axios"; // Axios instance for communicating with the Django backend.

    export default function Register() {

        // Store the username entered by the user.
        const [username, setUsername] = useState("");

        // Store the email entered by the user.
        const [email, setEmail] = useState("");

        // Store the password entered by the user.
        const [password, setPassword] = useState("");

        // Used to move the user to another page without refreshing.    
        const navigate = useNavigate();

        // Runs when the Register form is submitted.
        async function handleSubmit(event) {

            // Prevent the browser from refreshing.
            event.preventDefault();

            try {

                // Send the registration data to Django.
                const response = await api.post("register/", {
                    username,
                    email,
                    password,
                });

                console.log(response.data);

                alert("Registration Successful!");

                // Clear all input fields after successful registration.
                setUsername("");
                setEmail("");
                setPassword("");

                // Go to the Login page.
                navigate("/login");
                
            } catch (error) {

                // Display the error returned by Django.
                console.log(error.response.data);

                alert("Registration Failed");
            }
        }

        return (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-100 to-gray-200">

                {/* Registration Card */}
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

                    <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                        Create Account
                    </h1>

                    <p className="mb-8 text-center text-gray-500">
                        Register to start managing your tasks
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* Username */}
                        <input
                            type="text"
                            placeholder="Username"
                            className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password */}
                        <input
                            type="password"
                            placeholder="Password"
                            className="mb-6 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Register
                        </button>

                    </form>

                    {/* Link to Login Page */}
                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>

                </div>

            </div>
        );
    }