import QueryInput from "../query-input";
import UploadBtn from "../upload-btn"

export default function Info() {
  return (
    <div>
      <h1>Query your videos like a database!</h1>
      <h2 style={{ opacity: 0.6 }}>In just 2 simple steps!</h2>

      <h3>1. Upload a video</h3>
      <UploadBtn />

      <h3>2. Now simply query it</h3>
      <QueryInput />
    </div>
  );
}
