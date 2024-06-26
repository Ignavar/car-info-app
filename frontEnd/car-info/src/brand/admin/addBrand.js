import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";

const AddModelForm = () => {
  const [modelName, setModelName] = useState("");
  const [modelCountry, setModelCountry] = useState("");
  const [modelLogo, setModelLogo] = useState(null);
  const [response, setResponse] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validation can be added here before submitting
    if (!modelName.trim() || !modelCountry.trim() || !modelLogo) {
      setResponse("Please fill in all three fields");
      return;
    }

    // Pass the new model to the parent component
    try {
      await onAddModel();
    } catch (error) {
      setResponse(error.message);
    }
    // Clear the form inputs after submission
    setModelName("");
    setModelCountry("");
  };

  async function onAddModel() {
    const formData = new FormData();
    formData.append("modelName", modelName);
    formData.append("modelCountry", modelCountry);
    formData.append("modelLogo", modelLogo);

    const response = await fetch(`${config.apiUrl}/brand/addBrand`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      const message = await response.json();
      throw new Error(JSON.stringify(message["message"]));
    }
    const message = await response.json();
    setResponse(JSON.stringify(message["message"]));
  }

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Log the selected file
    setModelLogo(file);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md p-8 rounded-lg mb-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Brand</h2>
        <div className="mb-4">
          <label
            htmlFor="modelName"
            className="block text-gray-700 font-bold mb-2"
          >
            Brand Name
          </label>
          <input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value.trim())}
            placeholder="Enter Brand name"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="modelCountry"
            className="block text-gray-700 font-bold mb-2"
          >
            Brand Country
          </label>
          <input
            id="modelCountry"
            value={modelCountry}
            onChange={(e) => setModelCountry(e.target.value.trim())}
            placeholder="Enter Brands Country Of Origin"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          ></input>
        </div>
        <div className="mb-4">
          <label
            htmlFor="modelLogo"
            className="block text-gray-700 font-bold mb-2"
          >
            Brand Logo
          </label>
          <input
            type="file"
            id="modelLogo"
            onChange={handleLogoChange}
            accept=".jpg, .jpeg, .png .gif"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        {response && (
          <h2 className="m-8 text-center text-red-500">{response}</h2>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Brand
          </button>
        </div>
      </form>
      <Link
        to="/"
        replace={true}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:"
      >
        Brand List
      </Link>
    </div>
  );
};

export default AddModelForm;
