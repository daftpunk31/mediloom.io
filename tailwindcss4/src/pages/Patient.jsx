import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faDownload, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import GSAPcomponent from "../components/GSAPcomponent";
import Header from "../components/Header";
import Fotter from "../components/Fotter";
import axios from "axios";
import config from '../urlConfig.js';

function Patient() {
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState(["", "", "", "", "", ""]);
    const [files, setFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [dataFetched, setDataFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const otpRefs = useRef([]);

    useEffect(() => {
        let timer;
        if (otpGenerated && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpGenerated, resendTimer]);

    const generateOtp = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.post(`${config.backendUrl}/api/generate-otp`,
                {
                apt:"apt"
            },
            {
                withCredentials: true // Include cookies in the request;
            });
            
            if (response.data.success) {
                setSuccess("OTP has been sent to your WhatsApp number. Please check your messages.");
                setOtpGenerated(true);
                setResendTimer(30);
                setCanResend(false);
            } else {
                setError(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoading(true);
            setError("");
            // Combine all OTP digits into a single string
            const otp = enteredOtp.join("");
            
            const response = await axios.post(`${config.backendUrl}/api/verify-otp`, {
                otp: otp // Send the complete OTP as a single string
            },{
                withCredentials: true // Include cookies in the request
            }
        );
            
            if (response.data.success) {
                setSuccess("OTP verified successfully!");
                setOtpVerified(true);
                // Clear OTP fields after successful verification
                setEnteredOtp(["", "", "", "", "", ""]);
            } else {
                setError(response.data.message || "Invalid OTP");
                // Clear OTP fields on error
                setEnteredOtp(["", "", "", "", "", ""]);
                // Focus on first OTP input field
                if (otpRefs.current[0]) {
                    otpRefs.current[0].focus();
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during verification");
            // Clear OTP fields on error
            setEnteredOtp(["", "", "", "", "", ""]);
            // Focus on first OTP input field
            if (otpRefs.current[0]) {
                otpRefs.current[0].focus();
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get('/api/patient/documents');
            
            if (response.data.success) {
                setFiles(response.data.documents);
                setDataFetched(true);
                setSuccess("Documents fetched successfully!");
            } else {
                setError(response.data.message || "Failed to fetch documents");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while fetching documents");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/patient/documents/${fileId}/download`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document-${fileId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            setError(err.response?.data?.message || "Failed to download document");
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (fileId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/patient/documents/${fileId}/view`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            window.open(url, '_blank');
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('View error:', err);
            setError(err.response?.data?.message || "Failed to view document");
        } finally {
            setLoading(false);
        }
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
        <>
            <GSAPcomponent />
            <Header />
            <section className="hero-section relative flex min-h-[100vh] w-full max-w-[100vw] flex-col overflow-hidden max-md:mt-[50px] mt-[80px]">
                {/* Welcome Section */}
                <div className="flex flex-col place-content-center items-center mb-12">
                    <div className="reveal-up gradient-text text-center text-6xl font-semibold uppercase leading-[80px] max-lg:text-4xl max-md:leading-snug">
                        <span>Welcome to Mediloom.io</span>
                        <br />
                        <span>User Name</span>
                    </div>
                    <div className="reveal-up mt-10 max-w-[450px] p-2 text-center text-gray-300 max-lg:max-w-full text-3xl">
                        Thank you for selecting our platform for your data privacy.
                    </div>
                    
                </div>

                {/* OTP Section */}
                <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mb-12">
                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                    {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
                    {loading && <div className="text-white mb-4 text-center">Loading...</div>}
                    
                    {!otpGenerated ? (
                        <button 
                            onClick={generateOtp} 
                            disabled={loading}
                            className="w-full max-w-xs mt-6 btn text-white py-3 px-6 rounded-lg items-center bg-[#7e22ce85] shadow-lg shadow-primary transition-transform duration-[0.3s] hover:scale-x-[1.03]"
                        >
                            {loading ? 'Sending OTP...' : 'Generate OTP'}
                        </button>
                    ) : !otpVerified ? (
                        <div className="w-full max-w-md mt-6 text-center space-y-6">
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
                                        className="w-12 h-12 text-center border-2 rounded-lg text-xl text-white border-primary bg-white/10"
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button 
                                    onClick={verifyOtp}
                                    disabled={loading || enteredOtp.join("").length !== 6}
                                    className="w-full sm:w-auto bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Verify OTP
                                </button>
                                <button 
                                    onClick={generateOtp}
                                    disabled={loading || !canResend}
                                    className={`w-full sm:w-auto py-2 px-6 rounded-lg transition-colors ${
                                        canResend 
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    }`}
                                >
                                    {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-5xl mx-auto p-6">
                            <div className="flex justify-center mb-6">
                                <button 
                                    onClick={fetchData} 
                                    className="bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                    Get Data
                                </button>
                            </div>

                            {/* Search and Filter Section */}
                            {dataFetched && (
                                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg shadow-lg bg-white/10">
                                    <div className="w-full sm:w-1/2 flex items-center bg-white/20 rounded-lg px-4 py-2">
                                        <FontAwesomeIcon icon={faSearch} className="text-gray-300 mr-3" />
                                        <input 
                                            type="text" 
                                            placeholder="Search documents..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-transparent text-white placeholder-gray-300 outline-none"
                                        />
                                    </div>

                                    <div className="w-full sm:w-auto relative">
                                        <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                                        <select 
                                            value={filter} 
                                            onChange={(e) => setFilter(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white appearance-none outline-none"
                                        >
                                            <option value="all">All</option>
                                            <option value="Report">Reports</option>
                                            <option value="Prescription">Prescriptions</option>
                                            <option value="Lab Report">Lab Reports</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Documents List */}
                            <div className="mt-6 grid grid-cols-1 gap-4">
                                {filteredFiles.map((file, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white/10 flex justify-between items-center backdrop-blur-md scale-95 hover:scale-100 transition-transform duration-300 p-6 rounded-lg shadow-lg text-white"
                                    >
                                        <span className="text-lg font-semibold">{file.name}</span>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => handleView(file.id)}
                                                className="text-green-500 text-2xl hover:text-primary transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(file.id)}
                                                className="text-blue-500 text-2xl hover:text-primary transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Fotter />
        </>
    );
}

export default Patient;
