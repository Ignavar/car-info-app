import { useQuery } from "@tanstack/react-query";
import React, {
  useRef,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/authContext";
import config from "../config";
import FeedbackForm from "../feedback/feedback";
import FeedbackDisplay from "../feedback/listFeedback";
import { fetchCar, fetchFeedbackList, fetchModsList } from "./apis";

export default function CarDetails() {
  console.log("CarDetails component rendered");
  const location = useLocation();
  const modelId = useRef(location.state.id);
  const { isAdmin } = useContext(AuthContext);
  const [selectedMods, setSelectedMods] = useState([]);

  const { data: carData } = useQuery({
    queryKey: ["car", modelId.current],
    queryFn: () => fetchCar(modelId.current),
  });

  const { data: modsData } = useQuery({
    queryKey: ["mods", modelId.current],
    queryFn: () => fetchModsList(modelId.current),
  });

  const { data: feedbackData, refetch: refetchFeedback } = useQuery({
    queryKey: ["feedback", modelId.current],
    queryFn: () => fetchFeedbackList("model", modelId.current),
  });

  const car = carData?.cars || [];
  const mods = modsData?.mods || [];
  const feedback = useMemo(() => feedbackData || [], [feedbackData]);

  const deleteFeedback = useCallback(
    async (index) => {
      try {
        const response = await fetch(
          `${config.apiUrl}/feedback/deleteFeedback`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              brandId: feedback[index].feedbackId,
            }),
          },
        );
        if (!response.ok) {
          const message = await response.json();
          throw new Error(JSON.stringify(message.message));
        }
        refetchFeedback();
      } catch (error) {
        console.log(error.message);
      }
    },
    [feedback, refetchFeedback],
  );

  const totalPrice = () => {
    const selectedModPrices = selectedMods.reduce(
      (acc, index) => acc + Math.round(mods[index].price),
      0,
    );
    return car[0] ? Math.round(car[0].carPrice) + selectedModPrices : 0;
  };

  const handleClick = (index) => {
    setSelectedMods((prevSelectedMods) =>
      prevSelectedMods.includes(index)
        ? prevSelectedMods.filter((modIndex) => modIndex !== index)
        : [...prevSelectedMods, index],
    );
  };

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-center">
        {car.map((carItem) => (
          <div
            key={carItem.carId}
            className="max-w-4xl bg-white shadow-md p-8 rounded-lg mb-4 flex"
          >
            <div className="flex-shrink-0">
              <img
                src={`${config.apiUrl}/${carItem.carImage}`}
                alt={`${carItem.carName} ${carItem.carModel}`}
                className="h-48 w-auto rounded-lg"
              />
            </div>
            <div className="ml-4 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {carItem.carName} {carItem.carModel} {carItem.carVariant}
                </h2>
                <p className="text-lg text-gray-700 mb-2">
                  {carItem.carDescription}
                </p>
                <p className="text-xl text-gray-900 font-bold mb-2">
                  Price: {totalPrice()} Rs
                </p>
                <p className="text-xl text-gray-900 font-bold mb-2">
                  Transmission type: {carItem.carTransmission}
                </p>
                <p className="text-xl text-gray-900 font-bold mb-2">
                  Engine Size: {carItem.carEngineSize}
                </p>
              </div>
              {isAdmin ? (
                <Link to="/addMods" state={{ carId: carItem.carId }}>
                  <button className="w-6/12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                    Add Mods
                  </button>
                </Link>
              ) : null}
            </div>
          </div>
        ))}
        <div className="w-auto ml-4 flex flex-col gap-2 items-center justify-center">
          {mods.map((mod, index) => (
            <button
              key={mod.name}
              onClick={() => handleClick(index)}
              className={`w-full flex-1 px-6 py-3 ${
                selectedMods.includes(index)
                  ? "bg-red-500 hover:bg-red-600 focus:border-red-300"
                  : "bg-blue-500 hover:bg-blue-600 focus:border-blue-300"
              } text-white rounded-md focus:outline-none focus:ring `}
            >
              {selectedMods.includes(index)
                ? "Remove " + mod.name
                : "Add " + mod.name}
            </button>
          ))}
        </div>
      </div>
      <FeedbackForm
        option={"modelId"}
        id={modelId.current}
        onSubmit={refetchFeedback}
      />
      <h1 className="text-3xl font-bold text-center mt-8 mb-4">
        Feedbacks on Model
      </h1>
      <ul className="w-screen divide-y divide-gray-200">
        {feedback.map((feedbackItem, index) => (
          <li key={index} className="py-4 border-none">
            <FeedbackDisplay
              text={feedbackItem.description}
              name={feedbackItem.name}
              deleteFeedback={() => deleteFeedback(index)}
            />
            <hr className="my-4 border-t-2 border-black" />
          </li>
        ))}
      </ul>
    </div>
  );
}
