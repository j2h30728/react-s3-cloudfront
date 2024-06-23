import { Link } from "react-router-dom";

import useCharacterList from "#/hooks/characters/useCharacterList";
import useIntersectionObserver from "#/hooks/useIntersectionObserver";
import makeImagePathname from "#/utils/makeImagePathname";

const CharacterList = () => {
  const { data, loadMoreData, isFetching, error } = useCharacterList();

  const lastItemRef = useIntersectionObserver(loadMoreData);
  return (
    <div>
      {data.map((character, index) => (
        <div key={character.id + character.name + index} ref={index === data.length - 1 ? lastItemRef : null}>
          <img
            width={300}
            height={300}
            src={makeImagePathname(character.thumbnail.path, character.thumbnail.extension)}
          />
          <Link to={`/character/${character.id}`}>{character.name}</Link>
        </div>
      ))}
      {isFetching && <h1>Loading...</h1>}
      {error && <p>Error loading data!</p>}
    </div>
  );
};

export default CharacterList;
