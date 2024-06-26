import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import config from "../../config";

const AddCarModel = () => {
  const location = useLocation();
  const brandId = useRef(location.state.id);
  console.log(brandId.current);
  const [carName, setCarName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carVariant, setCarVariant] = useState("");
  const [transmission, setTransmission] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [response, setResponse] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation can be added here before submitting
    if (
      !carName.trim() ||
      !carModel.trim() ||
      !carVariant.trim() ||
      !transmission.trim() ||
      !image ||
      !description.trim() ||
      !price.trim() ||
      !engineSize.trim()
    ) {
      setResponse("Please fill in all fields.");
      return;
    }
    try {
      await onAddModel();
    } catch (error) {
      setResponse(error.message);
    }
    // Clear the form inputs after submission
    setCarName("");
    setCarModel("");
    setCarVariant("");
    setTransmission("");
    setImage(null);
    setDescription("");
    setPrice("");
    setEngineSize("");
  };

  async function onAddModel() {
    const formData = new FormData();
    formData.append("brandId", brandId.current);
    formData.append("modelName", carName);
    formData.append("model", carModel);
    formData.append("modelVariant", carVariant);
    formData.append("modelTransmission", transmission);
    formData.append("modelLogo", image);
    formData.append("modelDescription", description);
    formData.append("modelPrice", price);
    formData.append("modelEngineSize", engineSize);

    const response = await fetch(`${config.apiUrl}/model/addModel`, {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="m-28 max-w-lg mx-auto bg-white shadow-md p-8 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add New Car Model
        </h2>
        <div className="mb-4">
          <label
            htmlFor="carName"
            className="block text-gray-700 font-bold mb-2"
          >
            Car Name
          </label>
          <input
            type="text"
            id="carName"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Enter car name"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="carModel"
            className="block text-gray-700 font-bold mb-2"
          >
            Car Model
          </label>
          <input
            type="text"
            id="carModel"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="Enter car model"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="engineSize"
            className="block text-gray-700 font-bold mb-2"
          >
            Engine Size
          </label>
          <input
            type="number"
            id="engineSize"
            value={engineSize}
            onChange={(e) => setEngineSize(e.target.value)}
            placeholder="Enter Engine Size in cc"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="carVariant"
            className="block text-gray-700 font-bold mb-2"
          >
            Car Variant
          </label>
          <input
            type="text"
            id="carVariant"
            value={carVariant}
            onChange={(e) => setCarVariant(e.target.value)}
            placeholder="Enter car variant"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="transmission"
            className="block text-gray-700 font-bold mb-2"
          >
            Transmission Type
          </label>
          <input
            type="text"
            id="transmission"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            placeholder="Enter transmission type"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter Price"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
            Car Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter car description"
            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            rows={4}
          ></textarea>
        </div>
        {response && (
          <h2 className="m-8 text-center text-red-500">{response}</h2>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Add Car Model
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCarModel;
