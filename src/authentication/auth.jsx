// Import authentication-related functions from the "firebase/auth" library.
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

// Import the "auth" object from the specified location in your project.
import { auth } from "./config";

// Import React and useEffect from the "react" library.
import React, { useEffect } from "react";


// Function to register a new user with email and password
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        throw error;
    }
};

// Function to log in a user with email and password
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        return user;
    } catch (error) {
        throw error;
    }
};

// Function to log out the currently logged-in user
export const logoutUser = async () => {
    try {
        await signOut(auth);
    }
    catch (error) {
        throw error;
    }
};

// Function to observe the authentication state changes
export const observeAuthState = (auth, onAuthChange) => {
    useEffect(() => {
        // Set up a listener for authentication state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            onAuthChange(user);
        });
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);
};

