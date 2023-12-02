// Import the React library for creating components.
import React from "react";

import AboutImage from "../assets/Left-about.png"

const About = () => {
    return (
        <div className="h-[calc(100vh-4.75rem)] bg-gradient-to-b from-white via-white to-blue-500 px-20 flex flex-col md:flex-row">
            <div className="w-full h-1/2 md:h-full md:w-1/2 flex items-center justify-centers">
                <img className="w-[40rem]" src={AboutImage} />
            </div>
            <div className="w-full h-1/2 md:h-full md:w-1/2 flex flex-col justify-center gap-2 self-center md:self-start">
                <h1 className="text-3xl md:text-6xl font-bold uppercase text-[#7B7B78] text-left">About us</h1>
                <h1 className="text-xl md:text-4xl font-semibold">What is <span className="text-[#AA1818]">X</span><span>-Track</span><br />Web application?</h1>
                <div className="w-[10rem] border-[3px] border-[#D9D9D9] my-5" />
                <p className="text-xl md:text-3xl">X-TRACK helps you track the expiration dates for bread in the inventory system</p>
            </div>
        </div>
    );
};

export default About;
