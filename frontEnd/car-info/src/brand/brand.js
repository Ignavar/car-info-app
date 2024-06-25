import React from "react";

function Brand({ name, country_of_origin, image }) {
  console.log(name + " rendered");
  return (
    <div className="w-full max-w-md p-4">
      <li
        key={name}
        className="flex items-center py-5 rounded hover:bg-gray-200"
      >
        <img
          className="h-16 w-22 rounded-full object-cover animate-spin-slow"
          src={image}
          alt={name}
        />
        <div className="ml-4">
          <p className="text-xl font-semibold text-gray-900">{name}</p>
          <p className="text-lg text-gray-500">{country_of_origin}</p>
        </div>
      </li>
    </div>
  );
}

export default React.memo(Brand);
