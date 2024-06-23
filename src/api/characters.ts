import { characterFetcher } from "./fetcher";

export const getCharacterList = (offset: number, limit = 30) => {
  return characterFetcher(`/characters?offset=${offset}&limit=${limit}`);
};

export const getDetailCharacter = (characterId: string) => {
  return characterFetcher(`/characters/${characterId}`);
};
