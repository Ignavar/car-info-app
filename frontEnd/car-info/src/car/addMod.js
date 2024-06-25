import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import config from "../config";

const AddMods = () => {
  const [modName, setModName] = useState("");
  const [modPrice, setModPrice] = useState("");
  const [response, setResponse] = useState("");
  const location = useLocation();
  const carId = useRef(location.state.carId);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validation can be added here before submitting
    if (!modName.trim() || !modPrice.trim()) {
      setResponse("Please fill in all three fields");
      return;
    }

    // Pass the new model to the parent component
    try {
      await onAddMod();
    } catch (error) {
      setResponse(error.message);
    }
    // Clear the form inputs after submission
    setModName("");
    setModPrice("");
  };

  async function onAddMod() {
    const formData = new FormData();
    formData.append("modName", modName); // Assuming modName, modPrice, carId are defined elsewhere
    formData.append("modPrice", modPrice);
    formData.append("carId", carId.current);
    const response = await fetch(`${config.apiUrl}/car/addMod`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(JSON.stringify(message["message"]));
    }
    const message = await response.json();
    setResponse(JSON.stringify(message["message"]));
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md p-8 rounded-lg mb-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Mod</h2>
        <div className="mb-4">
          <label
            htmlFor="modName"
            className="block text-gray-700 font-bold mb-2"
          >
            Mod Name
          </label>
          <input
            type="text"
            id="modName"
            value={modName}
            onChange={(e) => setModName(e.target.value.trim())}
            placeholder="Enter Mod Name"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="modPrice"
            className="block text-gray-700 font-bold mb-2"
          >
            Mod Price
          </label>
          <input
            id="modelCountry"
            type="number"
            value={modPrice}
            onChange={(e) => setModPrice(e.target.value.trim())}
            placeholder="Enter Price of Mod"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          ></input>
        </div>
        {response && (
          <h2 className="m-8 text-center text-red-500">{response}</h2>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Mod
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMods;
