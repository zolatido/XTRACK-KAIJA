// Import React, useState, and useEffect from the "react" library.
import React, { useState } from "react";

// Import specific elements from the "react-router-dom" library.
import { Link, useNavigate } from "react-router-dom";

// Import the "observeAuthState" and "logoutUser" functions from the authentication module.
import { observeAuthState, logoutUser } from "../authentication/auth";

// Import the "auth" object from the specified location in your project.
import { auth } from "../authentication/config";

import Notification from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
import Charts from "../pages/Charts";

const NavBar = () => {

    // Import the 'useNavigate' hook to enable programmatic navigation
    const navigate = useNavigate();

    // Initialize state variables for user authentication and related information
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Indicates whether a user is logged in
    const [user, setUser] = useState(null); // Holds the user object if logged in
    const [email, setEmail] = useState(""); // Holds the user's email

    // Handle the authentication change
    const handleAuthChange = (firebaseUser) => {
        if (firebaseUser) {
            // If a user is authenticated, update the state variables
            setUser(firebaseUser);
            setIsLoggedIn(true);
            setEmail(firebaseUser.email || ""); // Store the user's email (if available)
            console.log('User logIn Successfully');
        } else {
            // If the user is not authenticated, reset the state variables
            setUser(null);
            setIsLoggedIn(false);
            console.log('User logOut Successfully');
        }
    };

    // Use the 'observeAuthState' function to observe the authentication state
    observeAuthState(auth, handleAuthChange);

    // Handle user logout
    const handleSubmitLogout = async () => {
        // Call the 'logoutUser' function to log the user out
        await logoutUser();

        // Navigate to the home page or any other desired route after logout
        navigate('/x-track-web/');
    }

    return (
        <div className="flex flex-row justify-between items-center mt-5 mx-5 lg:mx-20 px-5 lg:px-20 h-14 rounded-2xl bg-[#1F487E]/[.30]">
            {isLoggedIn ?
                <Link to="/XTRACK-KAIJA/home" className='flex flex-row uppercase font-bold text-xl lg:text-2xl'>
                    <h1 className="text-[#AA1818]">X</h1>
                    <h1>-Track</h1>
                </Link> :

                <Link to="/XTRACK-KAIJA/" className='flex flex-row uppercase font-bold text-xl lg:text-2xl'>
                    <h1 className="text-[#AA1818]">X</h1>
                    <h1>-Track</h1>
                </Link>
            }

            <div className="flex flex-row gap-10 font-bold text-lg items-center">
                {isLoggedIn ? <Link className="hover:text-[#1F487E]/[.80] hidden md:block" to='/XTRACK-KAIJA/home' >Home</Link> : null}
                {isLoggedIn ? null : <Link className="hover:text-[#1F487E]/[.80] hidden md:block" to='/XTRACK-KAIJA/about'>About</Link>}
                {isLoggedIn ? null : <Link className="hover:text-[#1F487E]/[.80] hidden md:block" to='/XTRACK-KAIJA/feature'>Feature</Link>}
                {isLoggedIn ? <Link className="hover:text-[#1F487E]/[.80] hidden md:block" to='/XTRACK-KAIJA/chart'>Chart</Link> : null}
                {isLoggedIn ? <Notification /> : null}
                {isLoggedIn ?
                    <ProfileMenu />
                    :
                    <Link className="hover:text-[#1F487E]/[.80]" to='/XTRACK-KAIJA/login'>Login</Link>
                }

            </div>
        </div>
    );
};

export default NavBar;
