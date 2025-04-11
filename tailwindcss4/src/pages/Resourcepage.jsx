import React, { useState } from "react";
import GSAPcomponent from "../components/GSAPcomponent";
import Header from "../components/Header";
import Fotter from "../components/Fotter";

function Resourcepage() {
  const [resources, setResources] = useState([{ resourceName: "", quantity: "" }]);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  // Handle input changes
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedResources = [...resources];

    // Prevent negative quantity
    if (name === "quantity" && value < 0) {
      updatedResources[index][name] = "0";
    } else {
      updatedResources[index][name] = value;
    }

    setResources(updatedResources);
  };

  // Add new resource field
  const addResource = () => {
    if (resources.length < 10) {
      setResources([...resources, { resourceName: "", quantity: "0" }]);
    } else {
      alert("You can add a maximum of 10 resources.");
    }
  };

  // Remove a resource field
  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  // Validate and submit resources
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if any field is empty
    for (let resource of resources) {
      if (!resource.resourceName.trim() || !resource.quantity.trim()) {
        alert("Please fill out all fields before submitting.");
        return;
      }
    }

    console.log("Submitting Resources:", resources);
    // Simulating backend submission
    setTimeout(() => {
      setSuccessMessage("Submission Successful! ✅");
      setResources([{ resourceName: "", quantity: "" }]); // Reset form
      setTimeout(() => setSuccessMessage(""), 3000); // Hide message after 3 seconds
    }, 1000); // Simulate API response delay
  };

  return (
    <><GSAPcomponent />
    <Header />
    <section className="hero-section relative flex min-h-[100vh] w-full max-w-[100vw] flex-col overflow-hidden max-md:mt-[50px] mt-[80px]" id="hero-section">
      <div className="flex flex-col place-content-center items-center">
        <div className="reveal-up gradient-text text-center text-6xl font-semibold uppercase leading-[80px] max-lg:text-4xl max-md:leading-snug">
          <span>Hospital Resource Management</span>
        </div>
        <div className="reveal-up mt-10 max-w-[450px] p-2 text-center text-gray-300 max-lg:max-w-full text-3xl">
          Add available hospital resources below.
        </div>
      </div>

      <div className="flex justify-center items-center">
        <section id="resourceSection" className="border-gradient relative flex w-full max-w-[80%] flex-col place-content-center place-items-center overflow-hidden p-6 transition-all mt-10">
          <div className="flex w-full h-full flex-col gap-3 text-center bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 transition-transform duration-300">
            <div className="text-white font-semibold">
              <form onSubmit={handleSubmit}>
                {resources.map((resource, index) => (
                  <div key={index} className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-md hover:bg-opacity-80 transition-all mt-4 flex flex-col">
                    <label className="flex justify-between items-center">
                      Resource Name:
                      <input
                        type="text"
                        name="resourceName"
                        value={resource.resourceName}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="form-control text-white border-1"
                      />
                    </label>

                    <label className="flex justify-between items-center mt-4">
                      Quantity:
                      <input
                        type="number"
                        name="quantity"
                        value={resource.quantity}
                        onChange={(e) => handleChange(index, e)}
                        required
                        min="0"
                        className="form-control text-white border-1"
                      />
                    </label>

                    {/* Remove Button */}
                    {resources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="bg-red-500 text-white py-1 px-4 rounded-md mt-4"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                {/* Add New Resource Button */}
                <button type="button" onClick={addResource} className="mt-4 btn bg-blue-500 text-white py-2 px-6 rounded-lg">
                  Add Resource
                </button>

                {/* Submit Button */}
                <section className="flex flex-col justify-center items-center mt-10">
                  <button type="submit" className="btn bg-[#7e22ce85] shadow-lg shadow-primary transition-transform duration-[0.3s] hover:scale-x-[1.03] hover:bg-opacity-80 text-white py-2 px-6 rounded-lg">
                    Submit All
                  </button>
                </section>
              </form>

              {/* Success Message */}
              {successMessage && <div className="mt-4 text-green-400 text-lg">{successMessage}</div>}
            </div>
          </div>
        </section>
      </div>
    </section>
    <Fotter />
    </>
  );
}

export default Resourcepage;
