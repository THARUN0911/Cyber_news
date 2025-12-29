import { useLocation, useNavigate } from "react-router-dom";

export default function Reader() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.url) {
    return (
      <div className="headline">
        <h1>Invalid article</h1>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  return (
    <div className="reader-page">
      <div className="reader-header">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2>{state.title}</h2>
      </div>

      <iframe
        src={state.url}
        title="Article"
        className="reader-frame"
      />
    </div>
  );
}
