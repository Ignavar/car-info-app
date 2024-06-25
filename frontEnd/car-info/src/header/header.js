import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import carImage from "../assets/Car_Info.jpg";

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  function handleClick() {
    logout();
  }

  return (
    <header className="sticky top-0 w-screen flex justify-between items-center p-4 bg-black text-white ">
      <div className="flex items-center">
        <img src={carImage} alt="Car Brand Logo" className="h-16 mr-5" />
        <div className="text-white">Car Brand Info</div>
      </div>
      <div className="flex space-x-4">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleClick}
            className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
