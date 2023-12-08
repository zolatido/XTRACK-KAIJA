// Import React and useState from the "react" library.
import React, { useState } from "react";

// Import specific elements from the "react-router-dom" library.
import { Link, useNavigate } from "react-router-dom";

// Import the "loginUser" function from the specified location.
import { loginUser } from "../authentication/auth";

// Import the "loginImage" from the "assets" folder. Make sure the path is correct.
import loginImage from '../assets/Left-login.png';

const Login = () => {

    // Import the 'useNavigate' hook to enable programmatic navigation
    const navigate = useNavigate();

    // Initialize state variables for email, password, and error messages
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(null); // Holds any error messages

    // Handle the form submission for user login
    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (email.trim() === '' || password.trim() === '') {
            setError('Please enter both email and password.');
            return;
        }

        try {
            // Attempt to log in the user with the provided email and password
            const user = await loginUser(email, password);

            // If login is successful, navigate to the '/home' route
            navigate('/XTRACK-KAIJA/home');
        } catch (error) {
            // Handle login errors, typically due to invalid credentials
            setError('Invalid email or password. Please try again.');
        }
    }

    return (
        <form onSubmit={handleSubmitLogin}>
            <div className="flex md:flex-row flex-col items-center h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-5 md:px-20">
                <div className="md:w-1/2 hidden md:flex md:flex-col items-center justify-center gap-10">
                    <h1 className="font-bold text-xl md:text-4xl text-center">Never let the bread expire again, track it before it’s too late!</h1>
                    <img className="h-48 w-48 md:h-96 md:w-96" src={loginImage} />
                </div>
                <div className="w-full md:w-1/2 py-20 flex flex-col bg-[#1F487E]/[.30] items-center justify-center m-20 gap-5 rounded-3xl">
                    <h1 className="text-5xl uppercase font-bold">Login</h1>
                    <input className="w-80 p-3 rounded-lg" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="w-80 p-3 rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="w-80 p-3 rounded-lg bg-[#1F487E] hover:bg-[#1F487E]/[.50] font-bold" type="submit">LOGIN</button>
                    <span>Don't have an account? <Link to='/XTRACK-KAIJA/register' className="font-bold">Register here</Link></span>
                    {error && <div className=" text-red-500">{error}</div>}
                </div>
            </div>
        </form>
    );
};

export default Login;
