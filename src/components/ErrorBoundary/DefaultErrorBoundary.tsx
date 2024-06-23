interface ErrorBoundaryProps {
  error: Error;
}

const DefaultErrorBoundary = ({ error }: ErrorBoundaryProps) => {
  return (
    <div>
      <h2>오류가 발생했습니다!</h2>
      <span>아래의 버튼을 눌러 홈으로 이동 해주세요.</span>
      <span>{error.message}</span>
      <button>
        <a href="/">홈으로 이동</a>
      </button>
    </div>
  );
};

export default DefaultErrorBoundary;
