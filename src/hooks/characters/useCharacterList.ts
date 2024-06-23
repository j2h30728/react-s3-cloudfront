import { getCharacterList } from "#/api/characters";
import { CharacterResponse } from "#/types/characters";
import useInfiniteSuspenseFetch from "../useInfiniteSuspenseFetch";

const useCharacterList = () => {
  const { data, status, error, loadMoreData, isFetching } = useInfiniteSuspenseFetch<CharacterResponse>(
    (offset) => getCharacterList(offset),
    `characters`
  );

  const format = data.flatMap((list) => list.results);

  return { data: format, status, error, loadMoreData, isFetching };
};
export default useCharacterList;
