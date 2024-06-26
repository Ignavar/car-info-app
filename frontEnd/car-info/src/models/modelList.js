import React, {
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useLocation, Link } from "react-router-dom";
import FeedbackForm from "../feedback/feedback.js";
import FeedbackDisplay from "../feedback/listFeedback.js";
import SearchBar from "../search/searchbar.js";
import Model from "./model.js";
import { AuthContext } from "../auth/authContext.js";
import { fetchFeedbackList, fetchModelList } from "./apis.js";
import { useQuery } from "@tanstack/react-query";
import config from "../config.js";

export default function ModelList() {
  const location = useLocation();
  const brand = useRef(location.state.id);
  const [searchKey, setSearchKey] = useState("");
  const { isAdmin } = useContext(AuthContext);

  console.log("model list rendered");

  const {
    status: modelStatus,
    error: modelError,
    data: modelData,
  } = useQuery({
    queryKey: ["models", searchKey],
    queryFn: () => fetchModelList("brand", searchKey, brand.current),
  });

  const {
    status: feedbackStatus,
    error: feedbackError,
    data: feedbackData,
    refetch: refetchFeedback,
  } = useQuery({
    queryKey: ["brandFeedback", brand.current],
    queryFn: () => fetchFeedbackList("brand", brand.current),
  });

  const models = modelData?.modelList || [];
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

  const handleFeedbackSubmit = () => {
    refetchFeedback();
  };

  if (modelStatus === "loading" || feedbackStatus === "loading")
    return <h1>Loading...</h1>;
  if (modelStatus === "error") return <h1>{JSON.stringify(modelError)}</h1>;
  if (feedbackStatus === "error")
    return <h1>{JSON.stringify(feedbackError)}</h1>;

  return (
    <>
      <SearchBar onSearch={setSearchKey} />
      <div className="flex flex-col justify-center gap-4">
        <div className="flex flex-row flex-wrap justify-center gap-4 p-4">
          {models.length > 0 ? (
            models.map((model) => (
              <Link
                to="/car"
                state={{ id: model.modelId }}
                className="flex items-center w-full max-w-md"
              >
                <Model
                  key={model.modelId}
                  name={model.modelName}
                  model={model.model}
                  variant={model.variant}
                  transmission={model.transmission}
                  image={`${config.apiUrl}/${model.image}`}
                />
              </Link>
            ))
          ) : (
            <p>No models found</p>
          )}
        </div>
        <div className="flex justify-center mt-4">
          {isAdmin ? (
            <Link
              to="/addCarModel"
              replace={true}
              state={{ id: brand.current }}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
            >
              Add Model
            </Link>
          ) : null}
        </div>
        <FeedbackForm
          option={"brandId"}
          id={brand.current}
          onSubmit={handleFeedbackSubmit}
        />
        <h1 className="text-3xl font-bold text-center mt-8 mb-4">
          Feedbacks on Brand
        </h1>
        <ul className="divide-y divide-gray-200">
          {feedback.length > 0 ? (
            feedback.map((feedbackItem, index) => (
              <li key={index} className="py-4 border-none">
                <FeedbackDisplay
                  text={feedbackItem.description}
                  name={feedbackItem.name}
                  deleteFeedback={() => deleteFeedback(index)}
                />
                <hr className="my-4 border-t-2 border-black" />
              </li>
            ))
          ) : (
            <p>No feedback found</p>
          )}
        </ul>
      </div>
    </>
  );
}
