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

    const CustomizedCross = (props) => {
        const { width, height, stroke, fill, formattedGraphicalItems } = props;
        console.log(props);
        // get first series in chart
        const firstSeries = formattedGraphicalItems[0];
        // get any point at any index in chart
        const secondPoint = firstSeries?.props?.points[1];

        // render custom content using points from the graph
        return (
            <Cross
                y={secondPoint?.y}
                x={secondPoint?.x}
                top={-50}
                left={70}
                height={height}
                width={width}
                stroke={stroke ?? '#000'}
                fill={fill ?? 'none'}

            />
        );
    };

    return (
        <div className="h-max lg:h-[calc(100vh-4.75rem)] w-full flex flex-col lg:flex-row bg-gradient-to-b from-white via-white to-blue-500 px-5 lg:px-20">
            <div className="w-full lg:w-1/2 h-full lg:h-auto md:py-5">
                <div className="h-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={productStatusData}
                            margin={{ bottom: 30, }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="fresh" stroke="#22c55e" />
                            <Line type="monotone" dataKey="expiringSoon" stroke="#FFA500" />
                            <Line type="monotone" dataKey="expired" stroke="#ef4444" />
                            <Customized component={CustomizedCross} />
                        </LineChart>
                    </ResponsiveContainer>

                </div>

                <div className="h-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={productStatusData}
                            margin={{ bottom: 30, }}>
                            <CartesianGrid strokeDasharray="10 10" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="fresh" stackId="1" stroke="#22c55e" fill="#22c55e" />
                            <Area type="monotone" dataKey="expiringSoon" stackId="1" stroke="#FFA500" fill="#FFA500" />
                            <Area type="monotone" dataKey="expired" stackId="1" stroke="#ef4444" fill="#ef4444" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="w-full lg:w-1/2 h-full lg:h-auto md:py-5">
                <div className="h-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productStatusData}
                            margin={{ bottom: 30, }}>
                            <CartesianGrid strokeDasharray="10 10" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={productStatusData}
                            margin={{ bottom: 30, }}>
                            <CartesianGrid strokeDasharray="10 10" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
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
