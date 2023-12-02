// Import the React library for creating components.
import React from "react";


const Feature = () => {
    return (
        <div className="h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-20 flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-4xl font-semibold uppercase text-[#7B7B78]">Our features</h1>
            <h1 className="text-3xl md:text-6xl font-semibold">What is <span className="text-[#AA1818]">X</span><span>-Track</span> Provides</h1>
            <div className="w-[15rem] md:w-[25rem] border-t-[3px] border-black mb-10 mt-5" />
            <div className="flex flex-row gap-5 md:gap-10">
                <div className="flex flex-col items-center ">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem] rounded-full bg-gradient-to-tr from-sky-200 via-white to-blue-500 border-[1px] border-black">

                    </div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Create</h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem] rounded-full bg-gradient-to-tr from-sky-200 via-white to-blue-500 border-[1px] border-black"></div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Read</h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem] rounded-full bg-gradient-to-tr from-sky-200 via-white to-blue-500 border-[1px] border-black"></div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Update</h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-[4rem] md:w-[6rem] h-[4rem] md:h-[6rem]w-[4rem] md:h-[6rem] rounded-full bg-gradient-to-tr from-sky-200 via-white to-blue-500 border-[1px] border-black"></div>
                    <h1 className="text-xl uppercase font-semibold mt-3">Delete</h1>
                </div>
            </div>
        </div>
    );
};

export default Feature;
