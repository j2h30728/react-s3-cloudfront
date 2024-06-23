import { getDetailCharacter } from "#/api/characters";
import useSuspenseFetch from "../useSuspenseFetch";

const useDetailCharacter = (characterId: string) => {
  const response = useSuspenseFetch(() => getDetailCharacter(characterId), characterId);
  return response.data?.results[0];
};
export default useDetailCharacter;
