import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./header/header";
import Login from "./auth/login";
import Register from "./auth/register";
import BrandList from "./brand/brandList";
import ModelList from "./models/modelList";
import Car from "./car/car";
import AddModelForm from "./brand/admin/addBrand";
import AddCarModel from "./models/admin/addModel";
import bgImg from "./assets/bg-car-image.jpg";
import AddMods from "./car/addMod";
import { useRouteError } from "react-router-dom";

function App() {
  const appStyle = {
    minHeight: "100vh", // Ensure app takes up at least full viewport height
    background: `url(${bgImg}) no-repeat center center`,
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
    width: "100%",
  };

  return (
    <div style={appStyle} className="">
      <Header />
      <div style={{ flex: 1, width: "100%" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<BrandList />} />
          <Route path="/addModel" element={<AddModelForm />} />
          <Route path="/modelList" element={<ModelList />} />
          <Route path="/addCarModel" element={<AddCarModel />} />
          <Route path="/car" element={<Car />} />
          <Route path="/addMods" element={<AddMods />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
