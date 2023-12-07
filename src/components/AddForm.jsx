// Import React and useState from the "react" library.
import React, { useState } from "react";

// Import the "DatePicker" component from the "react-datepicker" library.
import DatePicker from "react-datepicker";

// Import the default styles for "react-datepicker."
import "react-datepicker/dist/react-datepicker.css";

// Import the default styles for "tailwindcss."
import "tailwindcss/tailwind.css";

// Import the "db" and "auth" objects from the specified location in your project.
import { db, auth } from "../authentication/config";

// Import the "collection" and "addDoc" functions from the "firebase/firestore" library.
import { collection, addDoc } from "firebase/firestore";

const AddForm = () => {

    // Define a list of product options
    const optionsProduct = [
        { value: 'Gardenia Classic White Bread', label: 'Gardenia Classic White Bread' },
        { value: 'Gardenia High Fiber Whole Wheat', label: 'Gardenia High Fiber Whole Wheat' },
        { value: 'Gardenia High Fiber Wheat Raisin', label: 'Gardenia High Fiber Wheat Raisin' },
        { value: 'Gardenia Amazing Black Forest Loaf', label: 'Gardenia Amazing Black Forest Loaf'},
        { value: 'Gardenia Strawberry and Blueberry Loaf', label: 'Gardenia Strawberry and Blueberry Loaf'},
        { value: 'Marby Pinoy Tasty', label: 'Marby Pinoy Tasty' },
        { value: 'Marby Ube Loaf', label: 'Marby Ube Loaf' },
        { value: 'Marby Hopia Dice', label: 'Marby Hopia Dice' },
        { value: 'Marby Mongo Bread', label: 'Marby Mongo Bread' },
    ]

    // Define a list of expiration options
    const optionsExpiration = [
        { value: 'Top', label: 'Top' },
        { value: 'Bottom', label: 'Bottom' },
        { value: 'Left', label: 'Left' },
        { value: 'Right', label: 'Right' },
        { value: 'Back', label: 'Back' },
    ]

    // Initialize state variables
    const [showModal, setShowModal] = useState(false); // Controls whether to show a modal dialog
    const [productName, setProductName] = useState(''); // State for the product name
    const [productQuantity, setProductQuantity] = useState(''); // State for the product quantity
    const [productStickerLoc, setProductStickerLoc] = useState(''); // State for the sticker location
    const [productExpirationDate, setProductExpirationDate] = useState(new Date()); // State for the expiration date
    const [error, setError] = useState(null); // Holds any error messages

    // Handle form submission
    const handleSubmitData = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (productName.trim() === '' || productQuantity.trim() === '' || productStickerLoc.trim() === '') {
            setError('Please input all fields');
            return;
        }

        try {
            // Add data to the Firestore database
            const docRef = await addDoc(collection(db, "product"), {
                createdBy: auth.currentUser.uid,
                productName: productName,
                productQuantity: productQuantity,
                productStickerLoc: productStickerLoc,
                productExpirationDate: productExpirationDate,
            });
            // console.log(docRef.id, "Data is submitted successfully");

            // Reset form fields and hide the modal
            setShowModal(false);
            setProductName('');
            setProductQuantity('');
            setProductStickerLoc('');
            setProductExpirationDate(new Date());
        } catch (error) {
            // console.log(error, "Data is not submitted");
        }
    }

    return (
        <div>
            <button className="px-5 py-2 bg-[#1F487E]/[.30] hover:bg-[#1F487E]/[.80] rounded-md font-bold uppercase" onClick={() => setShowModal(true)}>Add item</button>

            {showModal ? (
                <>
                    <div className="backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-1/2 h-auto bg-[#1F487E]/[.80] rounded-3xl p-10">
                            <form onSubmit={handleSubmitData}>
                                <div className="flex flex-col gap-5">
                                    <h1 className=" text-5xl uppercase font-bold text-center mb-5">Add item</h1>
                                    <select onChange={(e) => setProductName(e.target.value)} selected={productName} className="block w-full px-6 py-3 rounded-lg">
                                        <option value='' disabled selected className="text-gray-400">
                                            Select a product.
                                        </option>
                                        {optionsProduct.map((option) => (
                                            <option key={option.value} >{option.label}</option>
                                        ))}
                                    </select>
                                    <input onChange={(e) => setProductQuantity(e.target.value)} selected={productQuantity} type='number' className="w-full px-6 py-3 rounded-lg " placeholder="Quantity of product" />

                                    <select onChange={(e) => setProductStickerLoc(e.target.value)} selected={productStickerLoc} className="block w-full px-6 py-3 rounded-lg">
                                        <option value='' disabled selected className="text-gray-400">
                                            Product sticker located at
                                        </option>
                                        {optionsExpiration.map((option) => (
                                            <option key={option.value} >{option.label}</option>
                                        ))}
                                    </select>

                                    <DatePicker onChange={(date) => setProductExpirationDate(date)} selected={productExpirationDate} className="w-full px-6 py-3 rounded-lg" placeholderText="Select a date" />
                                    {error && <div className="text-center text-red-500">{error}</div>}
                                    <div className="flex flex-row self-center gap-5">
                                        <button className="px-10 py-2 bg-red-500 rounded font-bold text-xl hover:bg-red-600" onClick={() => setShowModal(false)} >Close</button>
                                        <button className="px-10 py-2 bg-green-500 rounded font-bold text-xl hover:bg-green-600" type="submit">Add</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default AddForm;
