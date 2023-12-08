// Import React, useEffect, and useState from the "react" library.
import React, { useRef, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cross, LineChart, AreaChart, Area, Line, Customized, } from 'recharts';

// Import Firestore-related functions from the "firebase/firestore" library.
import { onSnapshot, collection, query, where } from "firebase/firestore";

// Import the "db" and "auth" objects from the specified location in your project.
import { db, auth } from "../authentication/config";

// Import the "observeAuthState" function from the authentication module.
import { observeAuthState } from "../authentication/auth";

const Charts = () => {

    const [aggregatedProducts, setAggregatedProducts] = useState([]);
    const [user, setUser] = useState(null); // Holds user information

    // Handle the authentication change
    const handleAuthChange = (firebaseUser) => {
        if (firebaseUser) {
            setUser(firebaseUser);
        } else {
            setUser(null);
        }
    };

    observeAuthState(auth, handleAuthChange);

    useEffect(() => {
        if (user) {
            const productCollectionRef = collection(db, 'product');
            const userSpecificQuery = query(productCollectionRef, where('createdBy', '==', user.uid));
            const unsubscribe = onSnapshot(userSpecificQuery, (snapshot) => {
                const productsStatusCount = {}; // Object to store status counts per product

                snapshot.forEach((doc) => {
                    const productData = doc.data();
                    const productExpirationDate = productData.productExpirationDate.toDate();
                    const today = new Date();

                    // Calculate the date 3 days before expiration
                    const notificationDate = new Date(productExpirationDate);
                    notificationDate.setDate(productExpirationDate.getDate() - 3);

                    let status;
                    if (today > productExpirationDate) {
                        status = 'Expired';
                    } else if (today >= notificationDate) {
                        status = 'Expiring Soon';
                    } else {
                        status = 'Fresh';
                    }

                    const productName = productData.productName;

                    // Initialize counters for each product if not present
                    if (!productsStatusCount[productName]) {
                        productsStatusCount[productName] = {
                            Expired: 0,
                            'Expiring Soon': 0,
                            Fresh: 0,
                            productName,
                            productQuantity: 0,
                        };
                    }

                    // Update status count for the specific product
                    if (status === 'Expired') {
                        productsStatusCount[productName].Expired += parseInt(productData.productQuantity, 10);
                    } else if (status === 'Expiring Soon') {
                        productsStatusCount[productName]['Expiring Soon'] += parseInt(productData.productQuantity, 10);
                    } else {
                        productsStatusCount[productName].Fresh += parseInt(productData.productQuantity, 10);
                    }

                    // Update total product quantity
                    productsStatusCount[productName].productQuantity += parseInt(productData.productQuantity, 10);
                });

                // Convert the object to an array of objects
                const aggregatedProducts = Object.values(productsStatusCount);
                console.log(aggregatedProducts)
                // Set the result to state or use as needed
                setAggregatedProducts(aggregatedProducts);
            });

            return () => {
                unsubscribe();
            };
        } else {
            setAggregatedProducts([]);
        }
    }, [user]);

    const productStatusData = aggregatedProducts.map(product => ({
        name: product.productName,
        expired: product.Expired,
        expiringSoon: product['Expiring Soon'],
        fresh: product.Fresh,
        quantity: product.productQuantity,
    }));

    return (
        <div className="h-full lg:h-[calc(100vh-4.75rem)] w-full flex flex-col lg:flex-row bg-gradient-to-b from-white via-white to-blue-500 px-5 lg:px-20 gap-5">
            <div className="w-full lg:w-1/3 h-full lg:h-auto md:py-10 py-5">
                <div className="flex flex-col border-2 rounded-xl h-full border-gray-900 bg-gray-100/50">
                    <div className="flex flex-row bg-[#1F487E]/[.20] h-10 items-center justify-between px-12 rounded-t-xl pr-20">
                        <span className="font-bold">Name</span>
                        <span className="font-bold">Quantity</span>
                    </div>

                    <div className="overflow-y-auto my-5">
                        {productStatusData.map((product, index) => (
                            <div key={index} className=" bg-gray-200 border-[1.5px] border-black/60 rounded-md flex flex-row pr-20 h-10 items-center justify-between px-5 mx-5 mt-2">
                                <span className="text-center truncate">{product.name}</span>
                                <span className="text-center truncate">{product.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-2/3 h-full lg:h-auto md:py-10">
                <div className="h-1/2 border-[1.5px] border-black/60 pb-10 mb-2 bg-gray-200 rounded-t-xl">
                    <div className="flex flex-row gap-2 px-10 pb-2 bg-[#1F487E]/[.20]">
                        <div className="font-medium">Product Quantity</div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productStatusData}>
                            <CartesianGrid strokeDasharray="10 10" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantity" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-1/2 border-[1.5px] border-black/60 pb-10 mb-2 bg-gray-200 rounded-t-xl">
                    <div className="flex flex-row gap-2 px-10 pb-2 bg-[#1F487E]/[.20]">
                        <div className="font-medium">Product Overview</div>
                        <div className="flex flex-row items-center gap-2"><div className="h-4 w-4 rounded-full bg-[#ef4444]" />Expired</div>
                        <div className="flex flex-row items-center gap-2"><div className="h-4 w-4 rounded-full bg-[#FFA500]" />Expiring Soon</div>
                        <div className="flex flex-row items-center gap-2"><div className="h-4 w-4 rounded-full bg-[#22c55e]" />Fresh</div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productStatusData}>
                            <CartesianGrid strokeDasharray="10 10" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="expired" stackId="a" fill="#ef4444" name="Expired" />
                            <Bar dataKey="expiringSoon" stackId="a" fill="#FFA500" name="Expiring Soon" />
                            <Bar dataKey="fresh" stackId="a" fill="#22c55e" name="Fresh" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;
