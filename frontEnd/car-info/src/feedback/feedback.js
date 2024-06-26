import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import config from "../config";

const FeedbackForm = ({ option, id, onSubmit }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [feedback, setFeedback] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setRedirect(true);
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      console.log(token);

      if (!token) {
        throw new Error("User not authenticated or token missing");
      }

      let modelId = null;
      let brandId = null;
      if (option === "modelId") {
        modelId = id;
      } else {
        brandId = id;
      }

      const response = await fetch(`${config.apiUrl}/feedback/add`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          modelId: modelId,
          brandId: brandId,
          feedback: feedback,
        }),
      });

      if (!response.ok) {
        const message = await response.json();
        throw new Error(message.message);
      }
      const message = await response.json();
      setFeedback(""); // Clear feedback input on successful submission
      setError(message["message"]);
      onSubmit();
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      setError(error.message);
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-md mx-auto mt-8 mb-8">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="feedback"
          className="flex justify-center font-block text-xl bold font-medium text-gray-700 mb-2"
        >
          {option === "modelId"
            ? "Enter your feedback on model"
            : "Enter your feedback on brand"}
        </label>
        <textarea
          id="feedback"
          className="block w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows="3"
          placeholder="Enter your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
        >
          Submit Feedback
        </button>
        {error && <h2 className="text-center text-red-500">{error}</h2>}
      </form>
    </div>
  );
};

export default React.memo(FeedbackForm);
