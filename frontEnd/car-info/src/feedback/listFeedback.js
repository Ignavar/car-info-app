import React from "react";

const FeedbackDisplay = ({ name, text }) => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">{name}</h2>
      <p className="text-grey-800">{text}</p>
    </div>
  );
};

export default React.memo(FeedbackDisplay);
