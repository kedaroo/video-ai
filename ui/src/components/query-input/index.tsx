import toast from "react-hot-toast";
import SendIcon from "../../assets/send.svg";
import { useStore } from "../../store/store";

export default function QueryInput() {
  const { videoPlayerRef } = useStore()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const query = formData.get("query") as string;

    if (!query) {
      alert("Please enter a query");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/query?query=${encodeURIComponent(query)}`,
        {
          method: "GET", // Use GET since we're passing data in the URL
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process query");
      }

      const results = await response.json()

      const timestamp = results.results[0].item.metadata.text

      if (videoPlayerRef?.current) {
        videoPlayerRef.current.currentTime = +timestamp
      }

      toast.success("Query processed successfully!");
    } catch (error) {
      console.error("Error processing query:", error);
      alert("Failed to process query");
    }
  };
  return (
    <form
      style={{
        display: "flex",
      }}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="query"
        autoComplete="off"
        placeholder="Query your video in natural language!"
      />

      <button
        type="submit"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={SendIcon} alt="send icon" className="invert" height={20} />
      </button>
    </form>
  );
}
