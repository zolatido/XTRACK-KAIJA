// Import React and useState from the "react" library.
import React, { useState } from "react";

// Import specific elements from the "react-router-dom" library.
import { Link, useNavigate } from "react-router-dom";

// Import the "registerUser" function from the specified location.
import { registerUser } from "../authentication/auth";

// Import the "loginImage" from the "assets" folder. Make sure the path is correct.
import loginImage from '../assets/Left-login.png';

const Register = () => {

    // Import the 'useNavigate' hook to enable programmatic navigation
    const navigate = useNavigate();

    // Initialize state variables for email, password, and error messages
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(null); // Holds any error messages

    // Handle the form submission for user registration
    const handleSubmitRegister = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (email.trim() === '' || password.trim() === '') {
            setError('Please enter both email and password.');
            return;
        }

        try {
            // Attempt to register the user with the provided email and password
            const user = await registerUser(email, password);

            // If registration is successful, navigate to the '/login' route and display an alert
            navigate('/XTRACK-KAIJA/login');
            alert('User registered!');
        } catch (error) {
            // Handle registration errors, typically due to an already registered email
            setError('Email is already registered. Please try again.');
        }
    }

    return (
        <form onSubmit={handleSubmitRegister}>
            <div className="flex md:flex-row flex-col items-center h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-5 md:px-20">
                <div className="md:w-1/2 hidden md:flex md:flex-col items-center justify-center gap-10">
                    <h1 className="font-bold text-4xl text-center">Never let the bread expire again, track it before it’s too late!</h1>
                    <img className="h-96 w-96" src={loginImage} />
                </div>
                <div className="w-full md:w-1/2 py-20 flex flex-col bg-[#1F487E]/[.30] items-center justify-center m-20 gap-5 rounded-3xl">
                    <h1 className="text-5xl uppercase font-bold">Register</h1>
                    <input className="w-80 p-3 rounded-lg" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="w-80 p-3 rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="w-80 p-3 rounded-lg bg-[#1F487E] hover:bg-[#1F487E]/[.50] font-bold uppercase" type="submit">Register</button>
                    <span>Already have an account? <Link to='/XTRACK-KAIJA/login' className="font-bold">Login here</Link></span>
                    {error && <div className=" text-red-500">{error}</div>}
                </div>
            </div>
        </form>
    );
};

export default Register;
