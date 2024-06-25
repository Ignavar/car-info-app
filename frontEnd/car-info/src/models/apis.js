import config from "../config";

export function fetchModelList(option, searchKey, brandId) {
  return fetch(`${config.apiUrl}/model/listModels`, {
    method: "GET",
    headers: {
      searchKey: searchKey,
      brandId: brandId,
      option: option,
      Key: brandId,
    },
  }).then((response) => response.json());
}

export function fetchFeedbackList(option, Key) {
  return fetch(`${config.apiUrl}/feedback/listFeedback`, {
    method: "GET",
    headers: {
      searchKey: option,
      Key: Key,
    },
  }).then((response) => response.json());
}
