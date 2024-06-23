import { Suspense } from "react";
import CharacterList from "./components/CharacterList";
import APIErrorBoundary from "#/components/ErrorBoundary/APIErrorBoundary";

export default function Home() {
  return (
    <>
      <h1>HOME</h1>
      <APIErrorBoundary>
        <Suspense fallback={<div>로딩</div>}>
          <CharacterList />
        </Suspense>
      </APIErrorBoundary>
    </>
  );
}
