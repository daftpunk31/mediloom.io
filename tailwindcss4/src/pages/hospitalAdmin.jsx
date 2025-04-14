import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GSAPcomponent from "../components/GSAPcomponent";
import Header from "../components/Header";
import Fotter from "../components/Fotter";
import axios from "axios";
import config from "../urlConfig.js";

export default function HospitalAdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.backendUrl}/api/status`, { withCredentials: true })
      .then(response => {
        console.log("User is authenticated:", response.data.message);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert("Session expired. Please login again.");
          window.location.href = '/login';
        } else {
          console.error("Unexpected error:", error);
        }
      });
  }, []);

  return (
    <>
      <GSAPcomponent />
      <Header />
      <section className="hero-section relative flex min-h-[100vh] w-full max-w-[100vw] flex-col overflow-hidden max-md:mt-[50px] mt-[80px]">
        <div className="flex flex-col place-content-center items-center mb-12">
          <div className="reveal-up gradient-text text-center text-6xl font-semibold uppercase leading-[80px] max-lg:text-4xl max-md:leading-snug">
            <span>Welcome to Mediloom.io</span>
            <br />
            <span>Hospital Admin Dashboard</span>
          </div>
          <div className="reveal-up mt-10 max-w-[450px] p-2 text-center text-gray-300 max-lg:max-w-full text-3xl">
            Please choose an action to continue...
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => navigate("/resources")}
              className="text-white py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-semibold transition duration-200 shadow-lg hover:scale-[1.03]"
            >
              Resources
            </button>
            <button
              onClick={() => navigate("/staff")}
              className="text-white py-3 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-lg font-semibold transition duration-200 shadow-lg hover:scale-[1.03]"
            >
              Staff
            </button>
          </div>
        </div>
      </section>
      <Fotter />
    </>
  );
}
