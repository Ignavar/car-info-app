import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/authContext.js";
import SearchBar from "../search/searchbar.js";
import Brand from "./brand.js";
import config from "../config.js";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const { isAdmin } = useContext(AuthContext);
  useEffect(() => {
    const fetchBrandList = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/brand/listBrands`, {
          method: "GET",
          headers: {
            searchKey: searchKey,
          },
        });
        if (!response.ok) {
          const message = await response.json();
          throw new Error(message.message);
        }
        console.log("ASAD");
        const message = await response.json();
        setBrands(message.brandList);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchBrandList();
  }, [searchKey]);
  console.log("BrandList rendered");
  return (
    <>
      <SearchBar onSearch={setSearchKey} />
      <div className="flex flex-col justify-center gap-4 ">
        <div className="flex flex-row flex-wrap justify-center gap-4 p-4">
          {brands.map((brand) => (
            <Link
              to="/modelList"
              state={{ id: brand.brandId }}
              className="w-full max-w-md"
            >
              <Brand
                key={brand.brandId}
                id={brand.brandId}
                name={brand.Name}
                country_of_origin={brand.countryOfOrigin}
                image={`${config.apiUrl}/${brand.logo}`}
              />
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {isAdmin ? (
            <Link
              to="/addModel"
              replace={true}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              Add Brand
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
