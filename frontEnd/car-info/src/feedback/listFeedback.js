import React, { useContext } from "react";
import { AuthContext } from "../auth/authContext";

const FeedbackDisplay = ({ name, text, deleteFeedback }) => {
  const { isAdmin } = useContext(AuthContext);
  return (
    <div className="flex flex:row">
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-xl font-semibold mb-4">{name}</h2>
        <p className="text-grey-800">{text}</p>
      </div>
      {isAdmin ? (
        <button
          onClick={deleteFeedback}
          className="my-auto inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold min-h-8 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          Delete feedback
        </button>
      ) : null}
    </div>
  );
};

export default React.memo(FeedbackDisplay);
