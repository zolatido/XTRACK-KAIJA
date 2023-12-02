// Import React, useEffect, and useState from the "react" library.
import React, { useRef, useEffect, useState } from "react";

// Import Firestore-related functions from the "firebase/firestore" library.
import { onSnapshot, collection, query, where } from "firebase/firestore";

// Import the "db" and "auth" objects from the specified location in your project.
import { db, auth } from "../authentication/config";

// Import the "observeAuthState" function from the authentication module.
import { observeAuthState } from "../authentication/auth";

// Import the default styles for "react-datepicker."
import "react-datepicker/dist/react-datepicker.css";

// Import the default styles for "tailwindcss."
import "tailwindcss/tailwind.css";
import { Link } from "react-router-dom";

const NotificationMenu = () => {

    // Initialize state variables
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [products, setProducts] = useState([]); // Holds the user-specific product list
    const [user, setUser] = useState(null); // Holds user information

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

    // Handle the authentication change
    const handleAuthChange = (firebaseUser) => {
        if (firebaseUser) {
            setUser(firebaseUser);
        } else {
            setUser(null);
        }
    };

    // Use the 'observeAuthState' function to observe the authentication state
    observeAuthState(auth, handleAuthChange);

    // Fetch user-specific expired and expiring-soon products and update the state when the user is authenticated
    useEffect(() => {
        if (user) {
            const productCollectionRef = collection(db, 'product');
            const userSpecificQuery = query(productCollectionRef, where('createdBy', '==', user.uid));
            const unsubscribe = onSnapshot(userSpecificQuery, (snapshot) => {
                const updatedProducts = [];
                const today = new Date();

                snapshot.forEach((doc) => {
                    const productData = doc.data();
                    const productExpirationDate = productData.productExpirationDate.toDate();

                    // Calculate the date 3 days before expiration
                    const notificationDate = new Date(productExpirationDate);
                    notificationDate.setDate(productExpirationDate.getDate() - 3);

                    // Check if the product is expired or expiring soon
                    if (today > productExpirationDate) {
                        const product = {
                            id: doc.id,
                            ...productData,
                            status: <span className="text-red-500">Expired</span>,
                        };
                        updatedProducts.push(product);
                    } else if (today >= notificationDate) {
                        const product = {
                            id: doc.id,
                            ...productData,
                            status: <span className="text-orange-500">Expiring Soon</span>,
                        };
                        updatedProducts.push(product);
                    }
                });
                setProducts(updatedProducts);
            });
            return () => {
                unsubscribe();
            };
        } else {
            setProducts([]);
        }
    }, [user]);

    // Determine if there are expired or expiring soon products
    const hasExpiredOrExpiringSoonProducts = products.some(
        (product) => product.status.props.children === "Expired" || product.status.props.children === "Expiring Soon"
    );

    return (
        <div className="relative md:inline-block text-left hidden">
            <div>
                <button type="button" onClick={toggleDropdown} className="flex flex-row items-center justify-center gap-1">
                    <span className='hover:text-[#1F487E]/[.80]'>Notification</span>
                    {hasExpiredOrExpiringSoonProducts && (
                        <span className="absolute h-2 w-2 rounded-full bg-red-500 top-0 right-0"></span>
                    )}
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div ref={dropdownRef} className="py-1 px-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {products.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
                        ) : (
                            products.map((product) => (
                                <Link to='/x-track-web/home' key={product.id} className="flex justify-between px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 border-b-[1px] border-b/50">
                                    <span className="w-[12rem] truncate">{product.productName}</span>
                                    <span className="w-[8rem] truncate">{product.productExpirationDate.toDate().toDateString()}</span>
                                    <span className="w-[8rem] truncate">{product.status}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

    );
};

export default NotificationMenu;
