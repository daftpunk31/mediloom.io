import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import GSAPcomponent from "../components/GSAPcomponent";
import Header from "../components/Header";
import Fotter from "../components/Fotter";

function Patient() {
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState(["", "", "", "", "", ""]);
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [dataFetched, setDataFetched] = useState(false);
    const otpRefs = useRef([]);

    

    const generateOtp = () => {
        setOtpGenerated(true);
    };

    

    const fetchData = () => {
        const dummyFiles = [
            { name: "Document1.pdf", category: "Report", url: "#" },
            { name: "Document2.pdf", category: "Prescription", url: "#" },
            { name: "Document3.pdf", category: "Lab Report", url: "#" }
        ];
        setFiles(dummyFiles);
        setDataFetched(true);
    };

    const handleOtpChange = (e, index) => {
        let newOtp = [...enteredOtp];
        newOtp[index] = e.target.value;
        setEnteredOtp(newOtp);

        if (e.target.value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            let newOtp = [...enteredOtp];
            if (!enteredOtp[index] && index > 0) {
                otpRefs.current[index - 1].focus();
            }
            newOtp[index] = "";
            setEnteredOtp(newOtp);
        }
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter === "all" || file.category === filter)
    );

    return (
        <><GSAPcomponent />
        <Header />
        <section className="hero-section relative flex min-h-[100vh] w-full max-w-[100vw] flex-col overflow-hidden max-md:mt-[50px] mt-[80px]"
                id="hero-section">
                    
            <div className="flex flex-col place-content-center items-center">
                <div className="reveal-up gradient-text text-center text-6xl font-semibold uppercase leading-[80px] max-lg:text-4xl max-md:leading-snug">
                    <span> Welcome to Mediloom.io</span>
                    <br />
                    <span> User Name</span>
                </div>
                <div className="reveal-up mt-10 max-w-[450px] p-2 text-center text-gray-300 max-lg:max-w-full text-3xl">
                    Thank you for selecting our platform for your data privacy.
                </div>
            </div>

            
                <div className="flex justify-center items-center">
                    {!otpGenerated ? (
                        <button onClick={generateOtp} className="mt-6 btn text-white py-2 px-6 rounded-lg items-center">
                            Generate OTP
                        </button>
                    ) : (
                        <div className="mt-6 text-center">
                            <div className="flex gap-2 justify-center">
                                {enteredOtp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-12 h-12 text-center border-1 rounded-lg text-xl text-white border-primary"
                                    />
                                ))}
                            </div>
                            <button  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg">
                                Verify OTP
                            </button><br></br>
                            <button  className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg">
                                Resend OTP
                            </button>
                            
                        </div>
                    )}
                </div>
            

            <div className="flex justify-center items-center">
                
                    <div className="mt-6 text-center w-full max-w-5xl p-6 rounded-lg overflow-auto shadow-lg">
                        <button onClick={fetchData} className="bg-purple-500 text-white py-2 px-6 rounded-lg">
                            Get Data
                        </button>

                        {/* Show search and filter options only after fetching data */}
                        {dataFetched && (
                            <div className="mt-6 flex flex-wrap justify-between items-center p-4 rounded-lg shadow-lg">
                                
                                {/* Search Bar (Left-Aligned) */}
                                <div className="flex items-center bg-white/20 rounded-lg px-4 py-2 w-full sm:w-1/2">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-300 mr-3" />
                                    <input 
                                        type="text" 
                                        placeholder="Search documents..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent text-white placeholder-gray-300 outline-none"
                                    />
                                </div>

                                {/* Filter (Right-Aligned) */}
                                <div className="relative mt-2 sm:mt-0">
                                    <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                                    <select 
                                        value={filter} 
                                        onChange={(e) => setFilter(e.target.value)} 
                                        className="pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white appearance-none outline-none"
                                    >
                                        <option value="all">All</option>
                                        <option value="Report">Reports</option>
                                        <option value="Prescription">Prescriptions</option>
                                        <option value="Lab Report">Lab Reports</option>
                                    </select>
                                </div>
                            </div>
                        )}

                       
                            <div className="mt-6 grid grid-cols-1 gap-4">
                                {filteredFiles.map((file, index) => (
                                    <div key={index} className="bg-white/10 flex justify-between items-center backdrop-blur-md scale-95 hover:scale-100 transition-transform duration-300 p-6 rounded-lg shadow-lg text-white">
                                        {/* Document Name */}
                                        <span className="text-lg font-semibold">{file.name}</span>

                                        {/* Icons */}
                                        <div className="flex gap-4">
                                            <button className="text-green-500 text-2xl hover:text-primary">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button className="text-blue-500 text-2xl hover:text-primary">
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                    </div>
                
            </div>
        </section>
        <Fotter />
        </>
    );
}

export default Patient;
