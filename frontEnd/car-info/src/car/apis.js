import config from "../config";

export async function fetchFeedbackList(option, modelId) {
  return fetch(`${config.apiUrl}/feedback/listFeedback`, {
    method: "GET",
    headers: {
      searchKey: option,
      Key: modelId,
    },
  }).then((response) => response.json());
}

export async function fetchCar(modelId) {
  return fetch(`${config.apiUrl}/car/listCars`, {
    method: "GET",
    headers: {
      brandId: modelId,
    },
  }).then((response) => response.json());
}
export async function fetchModsList(modelId) {
  return fetch(`${config.apiUrl}/car/listMods`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      brandId: modelId,
    },
  }).then((response) => response.json());
}
