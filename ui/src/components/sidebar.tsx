import React from 'react'
import UploadIcon from '../assets/upload.svg'
import toast, { Toaster } from 'react-hot-toast';

const Sidebar = () => {
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    toast('Starting file upload!')

    try {
      const response = await fetch("http://localhost:3000/api/v1/uploadChat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success('File uploaded successfully!')
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    }
  }

  return (
    <>
      <Toaster />
      <div className='hidden md:flex w-48 lg:w-64 p-4 flex-col bg-neutral-100'>
        <label className='bg-neutral-200 p-2 flex gap-2 rounded-lg transition-all hover:bg-neutral-300 cursor-pointer'>
          <img src={UploadIcon} alt='upload icon' className='h-6' />
          Upload chat
          <input onChange={onFileChange} type='file' className='hidden' accept=".txt" />
        </label>
      </div>
    </>

  )
}

export default Sidebar