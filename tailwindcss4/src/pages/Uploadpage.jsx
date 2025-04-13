import React, { useState, useRef } from "react";
import GSAPcomponent from "../components/GSAPcomponent";
import Header from "../components/Header";
import Fotter from "../components/Fotter";
import axios from "axios";
import config from '../urlConfig.js';

function Uploadpage() {
  const [showForm, setShowForm] = useState(false);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [testResultFiles, setTestResultFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hospitalId: '',
    patientId: '',
    patientName: '',
    department: '',
    doctorId: ''
  });

  // Refs to reset file input
  const prescriptionInputRef = useRef(null);
  const testResultInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection with max 10 files
  const handleFileChange = (event, setFiles, inputRef) => {
    let newFiles = Array.from(event.target.files);
    
    setFiles((prevFiles) => {
      if (prevFiles.length + newFiles.length > 10) {
        alert("You can upload a maximum of 10 files.");
        return prevFiles;
      }
      return [...prevFiles, ...newFiles];
    });
  
    inputRef.current.value = "";
  };
  
  // Remove a selected file
  const removeFile = (index, setFiles, inputRef) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      if (updatedFiles.length === 0) {
        inputRef.current.value = "";
      }
      return updatedFiles;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append prescription files
      prescriptionFiles.forEach((file, index) => {
        formDataToSend.append(`prescriptionFiles`, file);
      });

      // Append test result files
      testResultFiles.forEach((file, index) => {
        formDataToSend.append(`testResultFiles`, file);
      });

      // Send data to backend
      const response = await axios.post(`${config.baseUrl}/api/upload`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },{
        withCredentials: true
      });

      if (response.status === 200) {
        alert('Data uploaded successfully!');
        // Reset form
        setFormData({
          hospitalId: '',
          patientId: '',
          patientName: '',
          department: '',
          doctorId: ''
        });
        setPrescriptionFiles([]);
        setTestResultFiles([]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Failed to upload data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <><GSAPcomponent />
    <Header />
    <section className="hero-section relative flex min-h-[100vh] w-full max-w-[100vw] flex-col overflow-hidden max-md:mt-[50px] mt-[80px]" id="hero-section">
      <div className="flex flex-col place-content-center items-center">
        <div className="reveal-up gradient-text text-center text-6xl font-semibold uppercase leading-[80px] max-lg:text-4xl max-md:leading-snug">
          <span> Welcome to Mediloom.io</span>
          <br />
          <span> Here you can upload the data of the patients</span>
        </div>
        <div className="reveal-up mt-10 max-w-[450px] p-2 text-center text-gray-300 max-lg:max-w-full text-3xl">
          Thank you for selecting our platform.
        </div>
      </div>
      <div className="flex justify-center items-center">
        <button className="mt-6 btn text-white py-2 px-6 rounded-lg items-center" onClick={() => setShowForm(!showForm)}>
          Upload Data
        </button>
      </div>

      {showForm && (
        <div className="flex justify-center items-center">
        <section id="uploadDocsSection" className="border-gradient relative flex w-full max-w-[80%] flex-col place-content-center place-items-center overflow-hidden p-6 transition-all mt-10">
          <div className="reveal-up flex w-full h-full flex-col gap-3 text-center bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 transition-transform duration-300">
            <div className="text-white font-semibold">
              <form onSubmit={handleSubmit}>
                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex justify-between items-center hover:bg-opacity-80 transition-all mt-4">
                  Hospital ID: <input type="text" name="hospitalId" value={formData.hospitalId} onChange={handleInputChange} required className="form-control text-white border-1" />
                </label>
                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex justify-between items-center hover:bg-opacity-80 transition-all mt-4">
                  Patient ID: <input type="text" name="patientId" value={formData.patientId} onChange={handleInputChange} required className="form-control text-white border-1" />
                </label>
                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex justify-between items-center hover:bg-opacity-80 transition-all mt-4">
                  Patient Name: <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} required className="form-control text-white border-1" />
                </label>
                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex justify-between items-center hover:bg-opacity-80 transition-all mt-4">
                  Department: <input type="text" name="department" value={formData.department} onChange={handleInputChange} required className="form-control text-white border-1" />
                </label>

                {/* Prescription File Upload */}
                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex flex-col hover:bg-opacity-80 transition-all mt-4">
                  <span>Prescription ({prescriptionFiles.length}/10):</span>
                  <input type="file" multiple className="form-control text-white" ref={prescriptionInputRef} 
       onChange={(e) => handleFileChange(e, setPrescriptionFiles, prescriptionInputRef)} />

                  {prescriptionFiles.length > 0 && (
                    <div className="mt-2">
                      {prescriptionFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white/10 p-3 rounded-lg mt-2 shadow-md">
                          {file.type.startsWith("image/") && <img src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-16 object-cover rounded-md" />}
                          <span className="text-white">{file.name}</span>
                          <button type="button" className="bg-primary text-white py-1 px-3 rounded-md text-sm" onClick={() => removeFile(index, setPrescriptionFiles, prescriptionInputRef)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>

                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex justify-between items-center hover:bg-opacity-80 transition-all mt-4">
                  Doctor ID: <input type="text" name="doctorId" value={formData.doctorId} onChange={handleInputChange} required className="form-control text-white border-1 " />
                </label>

                {/* Test Results File Upload */}
                <label className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md flex flex-col hover:bg-opacity-80 transition-all mt-4">
                  <span>Test Results ({testResultFiles.length}/10):</span>
                  <input type="file" multiple className="form-control" ref={testResultInputRef} 
       onChange={(e) => handleFileChange(e, setTestResultFiles, testResultInputRef)} />

                  {testResultFiles.length > 0 && (
                    <div className="mt-2">
                      {testResultFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white/10 p-3 rounded-lg mt-2 shadow-md">
                          {file.type.startsWith("image/") && <img src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-16 object-cover rounded-md" />}
                          <span className="text-white">{file.name}</span>
                          <button type="button" className="bg-primary text-white py-1 px-3 rounded-md text-sm" onClick={() => removeFile(index, setTestResultFiles, testResultInputRef)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>

                <section className="flex flex-col justify-center items-center mt-10">
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn bg-[#7e22ce85] shadow-lg shadow-primary transition-transform duration-[0.3s] hover:scale-x-[1.03] hover:bg-opacity-80 text-white py-2 px-6 rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Uploading...' : 'Submit'}
                    </button>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </section>
        </div>
      )}
    </section>
    <Fotter />
    </>
  );
}

export default Uploadpage;
