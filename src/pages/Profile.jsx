// Import React, useEffect, and useState from the "react" library.
import React, { useEffect, useState } from "react";

// Import Firestore-related functions from the "firebase/firestore" library.
import { onSnapshot, collection, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

// Import the "db" and "auth" objects from the specified location in your project.
import { db, auth } from "../authentication/config";

// Import the "observeAuthState" function from the authentication module.
import { observeAuthState } from "../authentication/auth";

// Import the "DatePicker" component from the "react-datepicker" library.
import DatePicker from "react-datepicker";

// Import the default styles for "react-datepicker."
import "react-datepicker/dist/react-datepicker.css";

// Import the default styles for "tailwindcss."
import "tailwindcss/tailwind.css";

const Profile = () => {

    // Initialize state variables
    const [showDelete, setShowDelete] = useState(false); // Controls whether to show delete modal
    const [showUpdate, setShowUpdate] = useState(false); // Controls whether to show update modal
    const [products, setProducts] = useState([]); // Holds the user-specific product list
    const [productName, setProductName] = useState(''); // State for product name input
    const [productQuantity, setProductQuantity] = useState(''); // State for product quantity input
    const [productStickerLoc, setProductStickerLoc] = useState(''); // State for sticker location input
    const [productExpirationDate, setProductExpirationDate] = useState(new Date()); // State for expiration date input
    const [error, setError] = useState(null); // Holds any error messages
    const [user, setUser] = useState(null); // Holds user information

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

    // Fetch user-specific products and update the state when the user is authenticated
    useEffect(() => {
        if (user) {
            const productCollectionRef = collection(db, 'product');
            const userSpecificQuery = query(productCollectionRef, where('createdBy', '==', user.uid));
            const unsubscribe = onSnapshot(userSpecificQuery, (snapshot) => {
                const updatedProducts = [];

                snapshot.forEach((doc) => {
                    const productData = doc.data();
                    const product = {
                        id: doc.id,
                        ...productData,
                        status: getProductStatus(productData.productExpirationDate),
                    };
                    updatedProducts.push(product);
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


    // Function to determine the product status based on expiration date
    function getProductStatus(expirationDate) {
        const today = new Date();
        const expDate = expirationDate.toDate();

        // Calculate the date 3 days before expiration
        const notificationDate = new Date(expDate);
        notificationDate.setDate(expDate.getDate() - 3);

        if (expDate <= today) {
            return <span className="text-red-500">Expired</span>;
        } else if (today >= notificationDate) {
            return (
                <span className="text-orange-500">
                    Expiring Soon
                </span>
            );
        } else {
            return <span className="text-green-500">Fresh</span>;
        }
    }

    return (
        <div className="h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-20">
            {products.map((product) => (
                <div key={product.id} className=" flex flex-row items-center justify-center mx-5 my-3 bg-gray-200 border-[1.5px] border-black/60 rounded-lg h-10">
                    <span className="w-1/6 text-center">{product.productName}</span>
                    <span className="w-1/6 text-center">{product.productQuantity}</span>
                    <span className="w-1/6 text-center">{product.productStickerLoc}</span>
                    <span className="w-1/6 text-center">{product.productExpirationDate.toDate().toDateString()}</span>
                    <span className="w-1/6 text-center">{product.status}</span>
                    <div className="w-1/6 flex flex-row gap-5 items-center justify-center">
                        <button onClick={() => setShowUpdate(product.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                        <button onClick={() => setShowDelete(product.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>

                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Profile;
