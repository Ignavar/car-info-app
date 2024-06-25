import React from "react";

function Model({ name, model, variant, transmission, image }) {
  console.log(name + "rendered");
  return (
    <div className="w-full max-w-md p-4">
      <li
        key={name}
        className="flex items-center py-5 rounded hover:bg-gray-200"
      >
        <img
          className="h-24 w-22 rounded-full object-cover "
          src={image}
          alt={name}
        />
        <div className="ml-4">
          <p className="text-xl font-semibold text-gray-900">{name}</p>
          <p className="text-lg text-gray-500">{model}</p>
          <p className="text-lg text-gray-500">{variant}</p>
          <p className="text-lg text-gray-500">{transmission}</p>
        </div>
      </li>
    </div>
  );
}

export default React.memo(Model);
