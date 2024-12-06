import SendIcon from "../../assets/send.svg";

export default function QueryInput() {
  return (
    <form
      style={{
        display: "flex",
      }}
      // onSubmit={props.onSubmit}
    >
      <input
        type="text"
        name="prompt"
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
