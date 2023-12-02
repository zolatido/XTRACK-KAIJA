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

const TableData = () => {

    // Define a list of product options
    const optionsProduct = [
        { value: 'Rebisco Crackers', label: 'Rebisco Crackers' },
        { value: 'Gardenia Loaf bread', label: 'Gardenia Loaf bread' },
        { value: 'Lemon Square Cheese Cake', label: 'Lemon Square Cheese Cake' },
        { value: 'Cream O Cookies', label: 'Cream O Cookies' },
    ]

    // Define a list of expiration options
    const optionsExpiration = [
        { value: 'Top', label: 'Top' },
        { value: 'Bottom', label: 'Bottom' },
        { value: 'Left', label: 'Left' },
        { value: 'Right', label: 'Right' },
    ]

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

                // Sort products by status: Expired > Expiring Soon > Fresh
                updatedProducts.sort((a, b) => {
                    if (a.status.props.children === 'Expired') return -1;
                    if (b.status.props.children === 'Expired') return 1;
                    if (a.status.props.children === 'Expiring Soon') return -1;
                    if (b.status.props.children === 'Expiring Soon') return 1;
                    return 0;
                });

                setProducts(updatedProducts);
                console.log(updatedProducts)
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
                <span className="text-orange-500 truncate text-center">
                    Expiring Soon
                </span>
            );
        } else {
            return <span className="text-green-500">Fresh</span>;
        }
    }

    // Function to delete a product
    async function deleteProduct(productId) {
        try {
            const productRef = doc(db, 'product', productId);
            await deleteDoc(productRef);
            setShowDelete(false);
            console.log('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    // Function to update a product
    async function updateProduct(productId) {
        if (productName.trim() === '' || productQuantity.trim() === '' || productStickerLoc.trim() === '') {
            setError('Please input all fields');
            return;
        }
        try {
            const productRef = doc(db, 'product', productId);
            await updateDoc(productRef, {
                productName: productName,
                productQuantity: productQuantity,
                productStickerLoc: productStickerLoc,
                productExpirationDate: productExpirationDate,
            });
            console.log('Product Updated Successfully');
            setShowUpdate(false);
            setProductName('');
            setProductQuantity('');
            setProductStickerLoc('');
            setProductExpirationDate(new Date());
        } catch (error) {
            console.error('Error Updating product:', error);
        }
    }

    return (
        <div className="w-full border-2 border-gray-900 rounded-xl bg-gray-100/50 h-5/6">
            <div className="flex flex-row items-center justify-between md:justify-center h-16 bg-[#1F487E]/[.20] px-5">
                <span className="w-1/6 text-center font-semibold text-lg">Name</span>
                <span className="w-1/6 text-center font-semibold text-lg">Quantity</span>
                <span className="w-1/6 text-center font-semibold text-lg hidden md:block">Expiration Location</span>
                <span className="w-1/6 text-center font-semibold text-lg hidden md:block">Expiration Date</span>
                <span className="w-1/6 text-center font-semibold text-lg">Status</span>
                <span className="w-1/6 text-center font-semibold text-lg">Action</span>
            </div>
            <div className="h-5/6 overflow-y-auto mt-5">
                {products.map((product) => (
                    <div key={product.id} className=" flex flex-row items-center justify-between md:justify-center px-5 md:px-0 mx-5 my-3 bg-gray-200 border-[1.5px] border-black/60 rounded-lg h-10">
                        <span className="w-1/6 text-center truncate">{product.productName}</span>
                        <span className="w-1/6 text-center">{product.productQuantity}</span>
                        <span className="w-1/6 text-center hidden md:block">{product.productStickerLoc}</span>
                        <span className="w-1/6 text-center hidden md:block">{product.productExpirationDate.toDate().toDateString()}</span>
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
            {showUpdate ? (
                <>
                    <div className="backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-1/2 h-auto bg-[#1F487E]/[.80] rounded-3xl p-10">
                            <div className="flex flex-col gap-5">
                                <h1 className=" text-5xl uppercase font-bold text-center mb-5">Update Item</h1>
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
                                    <button className="px-10 py-2 bg-green-500 rounded font-bold text-xl hover:bg-green-600" onClick={() => setShowUpdate(false)} >Close</button>
                                    <button className="px-10 py-2 bg-red-500 rounded font-bold text-xl hover:bg-red-600" onClick={() => updateProduct(showUpdate)}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}

            {showDelete ? (
                <>
                    <div className="backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-5/12 h-auto bg-[#1F487E]/[.80] rounded-3xl p-10">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-5xl font-bold uppercase">Delete Item</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-32 h-32 -mb-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <span className="text-2xl font-bold">Are you sure?</span>
                                <span className="text-lg mb-5">This action will delete your item, <br /> You won't be able to revert this!</span>
                                <div className="flex flex-row self-center gap-5">
                                    <button className="px-10 py-2 bg-green-500 rounded font-bold text-xl hover:bg-green-600" onClick={() => setShowDelete(false)} >Close</button>
                                    <button className="px-10 py-2 bg-red-500 rounded font-bold text-xl hover:bg-red-600" onClick={() => deleteProduct(showDelete)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default TableData;
