import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const errorInLoader = useRouteError() as Error;

  return (
    <div>
      <h2>{errorInLoader ? errorInLoader.message : "잘못된 요청입니다."}</h2>
      <Link to={"/"}>메인페이지로 돌아가기</Link>
    </div>
  );
}
