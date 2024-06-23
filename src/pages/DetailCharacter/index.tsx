import APIErrorBoundary from "#/components/ErrorBoundary/APIErrorBoundary";
import { Suspense } from "react";
import CharacterInformation from "./components/CharacterInformation";

export default function DetailCharacter() {
  return (
    <>
      <h1>DetailCharacter</h1>
      <APIErrorBoundary>
        <Suspense fallback={<div>로딩</div>}>
          <CharacterInformation />
        </Suspense>
      </APIErrorBoundary>
    </>
  );
}
