// Import the React library for creating components.
import React from "react";

// Import the "AddForm" component from the specified location.
import AddForm from "../components/AddForm";

// Import the "TableData" component from the specified location.
import TableData from "../components/TableData";

const Home = () => {
    return (
        <div className="h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-5 lg:px-20">
            <div className="flex flex-row items-center justify-start py-5">
                <AddForm />
            </div>
            <TableData />
        </div>
    );
};

export default Home;
