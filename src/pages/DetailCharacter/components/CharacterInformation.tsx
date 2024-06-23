import { useParams } from "react-router-dom";

import useDetailCharacter from "#/hooks/characters/useDetailCharacter";
import makeImagePathname from "#/utils/makeImagePathname";

const CharacterInformation = () => {
  const { id } = useParams();
  const character = useDetailCharacter(id!);

  return (
    character && (
      <>
        <h2>{character?.name}</h2>
        <img
          width={400}
          height={400}
          src={makeImagePathname(character.thumbnail.path, character?.thumbnail.extension)}
        />
      </>
    )
  );
};

export default CharacterInformation;
