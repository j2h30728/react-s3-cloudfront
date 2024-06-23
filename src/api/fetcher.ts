import { BASE_URL } from "#/constants/baseURL";
import { CharacterResponse } from "#/types/characters";
import { ApiError } from "./customError";

type CharacterFetchType = (url: string) => Promise<CharacterResponse>;

export const characterFetcher: CharacterFetchType = async (endpoint: string) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(`HTTP error! Status: ${response.status}`);
  }
  const characterResponse = await response.json();
  return characterResponse.data;
};
