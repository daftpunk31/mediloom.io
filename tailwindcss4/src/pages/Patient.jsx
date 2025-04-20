import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch, faFilter, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import GSAPcomponent from "../components/GSAPcomponent";
import Header from "../components/Header";
import Fotter from "../components/Fotter";
import axios from "axios";
import config from '../urlConfig.js';
import { id } from "ethers";
import { connectContract } from "../blockchain/connectContract";

function Patient() {
    const navigate = useNavigate();
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
    const [aadharNumber, setAadharNumber] = useState("");
    const [aadharError, setAadharError] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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

    const validateAadhar = (number) => {
        // Remove any spaces or dashes
        const cleanNumber = number.replace(/[-\s]/g, '');
        // Check if it's exactly 12 digits
        return /^\d{12}$/.test(cleanNumber);
    };

    const handleAadharChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and format as XXXX-XXXX-XXXX
        const formattedValue = value
            .replace(/\D/g, '')
            .replace(/(\d{4})(?=\d)/g, '$1-')
            .slice(0, 14); // Max length with dashes
        
        setAadharNumber(formattedValue);
        setAadharError("");
    };

    const generateOtp = async (e) => {
        e.preventDefault();
        if (!validateAadhar(aadharNumber)) {
            setAadharError("Please enter a valid 12-digit Aadhar number");
            return;
        }

        try {
            setLoading(true);
            setError("");
            // console.log("Aadhar number:", aadharNumber.replace(/[-\s]/g, ''));
            // console.log("Backend URL:", `${config.backendUrl}/api/generate-otp`);
            const response = await axios.post(`${config.backendUrl}/api/generate-otp`, {
                aadharNumber: aadharNumber.replace(/[-\s]/g, ''),
            },{
                withCredentials: true // Include cookies in the request
            }
        );
            
            if (response.data.success) {
                setSuccess("OTP has been sent to the patient's WhatsApp number. Please check with your patient.");
                setOtpGenerated(true);
                setResendTimer(30);
                setCanResend(false);
            } else {
                setError(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to login if unauthorized
                alert("Session expired. Please login again.");
                window.location.href = '/login'
            }
            else{
            setError(error.response?.data?.message || "An error occurred while sending OTP");
            }
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoading(true);
            setError("");
            const otp = enteredOtp.join("");
            
            const response = await axios.post(`${config.backendUrl}/api/verify-otp`, {
                otp: otp
            },{
                withCredentials: true // Include cookies in the request
            });
            
            if (response.data.success) {
                setSuccess("OTP verified successfully!");
                setOtpVerified(true);
                setEnteredOtp(["", "", "", "", "", ""]);
            } else {
                setError(response.data.message || "Invalid OTP");
                setEnteredOtp(["", "", "", "", "", ""]);
                if (otpRefs.current[0]) {
                    otpRefs.current[0].focus();
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to login if unauthorized
                alert("Session expired. Please login again.");
                window.location.href = '/login'
            }
            else{
            setError(error.response?.data?.message || "An error occurred during verification");
            setEnteredOtp(["", "", "", "", "", ""]);
            if (otpRefs.current[0]) {
                otpRefs.current[0].focus();
            }
        }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(`${config.backendUrl}/api/documentsInfoFetch`,{
                withCredentials: true // Include cookies in the request
            });
            // console.log("Documents fetched:", response.data.documents);

            setFiles(Array.isArray(response.data.documents) ? response.data.documents : []);
            if (response.data.success && Array.isArray(response.data.documents)) {
                setFiles(response.data.documents);
                setDataFetched(true);
                setSuccess("Documents fetched successfully!");
            } else {
                setFiles([]); // Set to an empty array if documents is not valid
                setError(response.data.message || "Failed to fetch documents");
            }

            
            // if (response.data.success) {
            //     setFiles(response.data.documents);
            //     setDataFetched(true);
            //     setSuccess("Documents fetched successfully!");
            // } else {
            //     setError(response.data.message || "Failed to fetch documents");
            // }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to login if unauthorized
                alert("Session expired. Please login again.");
                window.location.href = '/login'
            }else{
            setError(error.response?.data?.message || "An error occurred while fetching documents");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (fileId) => {
        // console.log("File ID:", fileId); // Debugging
        try {
            // console.log("File ID:", fileId); // Debugging
            setLoading(true);
            const response = await axios.get(`${config.backendUrl}/api/documents/${fileId}/view` ,{
                withCredentials: true, // Include cookies in the request
                responseType: 'blob', // Set response type to blob for file download

            });
            // console.log("View response:", response); // Debugging
            console.log("View response:", response.data); // Debugging
            console.log('Response Content-Type:', response.headers['content-type']);
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
            
            const file = files.find(file => String(file.id) === String(fileId));
            if (!file) {
                console.error("File not found in the files array");
                setError("File not found");
                return;
            }
            console.log("Found file:", file); // Debugging
            // Set the content type based on server response
            file.type = response.headers['content-type'];
            setPreviewUrl(url);
            setPreviewFile(file);

        console.log("Preview URL:", url); // Debugging
        console.log("Preview File:", file); // Debugging
    } catch (err) {
        if (error.response && error.response.status === 401) {
            // Redirect to login if unauthorized
            alert("Session expired. Please login again.");
            window.location.href = '/login'
        }else{
        console.error('View error:', err);
        setError(err.response?.data?.message || "Failed to view document");
        }
    } finally {
        setLoading(false);
    }
};


    //         console.log("Files array:", files); // Debugging
    //         setPreviewFile(files.find(file => file.id === fileId));
    //         console.log("Preview URL:", url); // Debugging
    //         console.log("Preview File:", previewFile); // Debugging
    //     } catch (err) {
    //         console.error('View error:', err);
    //         setError(err.response?.data?.message || "Failed to view document");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const closePreview = () => {
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setPreviewFile(null);
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

    const handleResendOtp = async () => {
        if (!validateAadhar(aadharNumber)) {
            setAadharError("Please enter a valid 12-digit Aadhar number");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await axios.post('/api/generate-otp', {
                aadharNumber: aadharNumber.replace(/[-\s]/g, '')
            });
            
            if (response.data.success) {
                setSuccess("New OTP has been sent to the patient's WhatsApp number. Please check their messages.");
                setResendTimer(30);
                setCanResend(false);
                setEnteredOtp(["", "", "", "", "", ""]);
                if (otpRefs.current[0]) {
                    otpRefs.current[0].focus();
                }
            } else {
                setError(response.data.message || "Failed to send new OTP");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to login if unauthorized
                alert("Session expired. Please login again.");
                window.location.href = '/login'
            }
            else{
            setError(error.response?.data?.message || "An error occurred while sending new OTP");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = (files || []).filter(file =>
        file && file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter === "all" || file.type === filter)
    );



    const handleVerify = async (file) => {
        try {
            const ipfsHash = file.file_location?.split("/").pop(); // Get IPFS hash from URL
            if (!ipfsHash) {
                alert("IPFS hash not found in file metadata.");
                return;
            }
    
            const bytes32Hash = id(ipfsHash);
            const contract = await connectContract();
            console.log("Verifying bytes32 hash:", bytes32Hash);
            console.log("File location:", file.file_location);
            console.log("Extracted IPFS hash:", ipfsHash);
            console.log("Generated bytes32:", bytes32Hash);
    
            const [exists, uploader, timestamp] = await contract.verifyFile(bytes32Hash);
    
            if (exists) {
                alert(
                    `✅ File verified!\n` +
                    `Uploaded by: ${file.doc_name}\n` +
                    `Hospital: ${file.hospital_name} (${file.hospital_id})\n` +
                    `Timestamp: ${new Date(Number(timestamp) * 1000).toLocaleString()}\n`+
                    `Ethereium wallet address: ${uploader}\n`
                  );
                // alert(
                //     `✅ File verified!\nUploader: ${uploader}\nTimestamp: ${new Date(Number(timestamp) * 1000).toLocaleString()}`
                // );
            } else {
                alert("❌ File not found on blockchain.");
            }
        } catch (err) {
            console.error("Verification error:", err);
            alert("Verification failed. Check console.");
        }
    };
    


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
                        You can access and your files here.
                    </div>
                </div>

                {/* OTP Section */}
                <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mb-12">
                    {error && <div className="text-red-500 mb-4 text-center w-full">{error}</div>}
                    {success && <div className="text-green-500 mb-4 text-center w-full">{success}</div>}
                    {loading && <div className="text-white mb-4 text-center w-full">Loading...</div>}
                    
                    {!otpGenerated ? (
                        <div className="w-full max-w-md space-y-6">
                            <div className="w-full">
                                <input
                                    type="text"
                                    value={aadharNumber}
                                    onChange={handleAadharChange}
                                    placeholder="Enter Aadhar Number (XXXX-XXXX-XXXX)"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border-2 border-primary focus:outline-none focus:border-purple-500"
                                />
                                {aadharError && <div className="text-red-500 mt-2 text-sm text-center">{aadharError}</div>}
                            </div>
                            <div className="flex justify-center">
                                <button 
                                    onClick={generateOtp} 
                                    disabled={loading || !validateAadhar(aadharNumber)}
                                    className="w-full max-w-xs btn text-white py-3 px-6 rounded-lg items-center bg-[#7e22ce85] shadow-lg shadow-primary transition-transform duration-[0.3s] hover:scale-x-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending OTP...' : 'Generate OTP'}
                                </button>
                            </div>
                        </div>
                    ) : !otpVerified ? (
                        <div className="w-full max-w-md space-y-6">
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
                                    onClick={handleResendOtp}
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
                        <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
                            <div className="flex justify-center gap-4">
                                <button 
                                    onClick={fetchData} 
                                    className="bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                    Get Data
                                </button>
                            </div>

                            {/* Search and Filter Section */}
                            {dataFetched && (
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg shadow-lg bg-white/10">
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
                                            <option value="Report">Report</option>
                                            <option value="Prescription">Prescription</option>
                                            
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Documents List */}
                            <div className="grid grid-cols-1 gap-4">
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
                                            >                                              <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button onClick={() => handleVerify(file)} className="text-blue-400 text-2xl hover:text-blue-600 transition-colors">
                                            <FontAwesomeIcon icon={faUpload} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview Modal */}
                {previewFile && previewUrl && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-800">{previewFile.name}</h3>
                                <button 
                                    onClick={closePreview}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                {previewFile.type === 'application/pdf' ? (
                                    <iframe

                                        src={previewUrl} 
                                        className="w-full h-full min-h-[70vh]"
                                        title={previewFile.name}
                                    />
                                ) : previewFile.type === 'text/xml' || previewFile.type === 'text/plain' ? (
                                    <pre className="whitespace-pre-wrap">{response.data}</pre>
                                ) :(
                                    <img 
                                        src={previewUrl} 
                                        alt={previewFile.name}
                                        className="max-w-full h-auto"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
            <Fotter />
        </>
    );
}

export default Patient;
