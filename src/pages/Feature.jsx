// Import the React library for creating components.
import React from "react";

// Import the "rightimage" from the "assets" folder. Make sure the path is correct.
import create from '../assets/Create.png';
import deleteicon from '../assets/Delete.png';
import read from '../assets/Read.png';
import update from '../assets/Update.png';


const Feature = () => {
    return (
        <div className="h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-20 flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-4xl font-semibold uppercase text-[#7B7B78]">Our features</h1>
            <h1 className="text-3xl md:text-6xl font-semibold">What is <span className="text-[#AA1818]">X</span><span>-Track</span> Provides</h1>
            <div className="w-[15rem] md:w-[25rem] border-t-[3px] border-black mb-10 mt-5" />
            <div className="flex flex-row gap-5 md:gap-10">
                <div className="flex flex-col items-center ">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem]">
                    <img src={create} />
                    </div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Create</h1>
                    
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-[2rem] md:w-[4.5rem] h-[4rem] md:h-[6rem]">
                    <img src={read} />
                    </div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Read</h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem]">
                    <img src={update} />
                    </div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Update</h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem]">
                    <img src={deleteicon} />
                    </div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Delete</h1>
                </div>
            </div>
        </div>
    );
};

export default Feature;
