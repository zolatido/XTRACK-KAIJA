// Import React, useState, and useEffect from the "react" library.
import React, { useRef, useEffect, useState } from "react";

// Import specific elements from the "react-router-dom" library.
import { Link, useNavigate } from "react-router-dom";

// Import the "observeAuthState" and "logoutUser" functions from the authentication module.
import { observeAuthState, logoutUser } from "../authentication/auth";

// Import the "auth" object from the specified location in your project.
import { auth } from "../authentication/config";

import dropdown from "../assets/dropdown.svg"
import NotificationMenu from "./NotificationMenu";

const ProfileMenu = () => {

    // Import the 'useNavigate' hook to enable programmatic navigation
    const navigate = useNavigate();

    // Initialize state variables for user authentication and related information
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Indicates whether a user is logged in
    const [user, setUser] = useState(null); // Holds the user object if logged in
    const [email, setEmail] = useState(""); // Holds the user's email
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left z-50">
            <div>
                <button type="button" onClick={toggleDropdown} className="flex flex-row items-center justify-center gap-1">
                    <span className='hover:text-[#1F487E]/[.80]'>{email}</span>
                    <img className='h-5 w-5' src={dropdown} alt="Background" />
                </button>
            </div>
            {isOpen && (
                <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 px-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <Link className="hover:text-[#1F487E]/[.80] block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100" to='/x-track-web/home'>Home</Link>
                        <Link className="hover:text-[#1F487E]/[.80] block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100" to='/x-track-web/chart'>Chart</Link>
                        <Link className="hover:text-[#1F487E]/[.80] block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100" to='/x-track-web/about'>About</Link>
                        <Link className="hover:text-[#1F487E]/[.80] block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100" to='/x-track-web/feature'>Feature</Link>
                        <div className="border-t-[1px] w-auto border-black/20" />
                        <button className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 w-full text-left" onClick={handleSubmitLogout} > Logout</button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default ProfileMenu;
