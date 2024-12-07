import UploadIcon from "../../assets/upload.svg";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../../store/store";

export default function UploadBtn() {
  const { setVideoSrc } = useStore()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    const url = URL.createObjectURL(selectedFile); // Create a URL for the file
    setVideoSrc(url); // Set the video source

    const formData = new FormData();
    formData.append("video", selectedFile);

    toast("Starting file upload!");

    try {
      const response = await fetch("http://localhost:5000/api/v1/uploadVideo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    }
  };

  return (
    <>
      <Toaster />

      <div
        style={{          
          padding: "0.75rem",
          border: '1px solid black',
          borderRadius: "2rem",
          width: 'fit-content'
        }}
      >
        <label
          style={{
            display: "flex",
            gap: '0.5rem',
            cursor: "pointer",
          }}
        >
          <img src={UploadIcon} alt="upload icon" height={20} />
          Upload video
          <input
            onChange={onFileChange}
            type="file"
            style={{ display: "none" }}
            accept="video/*"
          />
        </label>
      </div>
    </>
  );
}
