import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';
import React, { useRef, useState } from 'react'

interface PersonalDetailsProps {
	goToPreviousStep: () => void;
	goToNextStep: () => void;
}

const UploadPortifolio = ({ goToPreviousStep, goToNextStep }: PersonalDetailsProps) => {
    
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFileName(file.name);
        setFile(file)
      }
    };
  
  
    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
  
      const file = event.target.files[0];
      setFileName(file.name);
      setFile(file)
  
      // Here you would typically handle the file upload process
      // For demonstration purposes, we're just logging the file size
      console.log(`Uploading file: ${file.name}, Size: ${file.size} bytes`);
        goToNextStep()
      // Example: Use ethers.js or another method to upload the file to IPFS or a blockchain
    };

  return (
    <div className="flex flex-col space-y-10">
    <h3 className="text-3xl font-medium- text-[#cbceeb]">Upload CV</h3>
    <div className="flex  flex-col items-start gap-4 justify-start ml-20">
    <div className="bg-[#B5D0FF] rounded-xl border border-dashed border-[#3F55C8] p-8 flex items-center justify-center flex-col">
    <div className="flex space-x-2">
      <UploadCloud className="text-primary-500" />
      <input
        type="file"
        accept=".doc, .docx, .pdf"
        onChange={handleFileChange}
        hidden
        ref={fileInputRef}
      />
      <p className="text-sm font-light">
        Click to{" "}
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            fileInputRef.current?.click();
          }}
          className="text-[#1336EA]"
        >
          Upload
        </a>{" "}
        File
      </p>
    </div>
    <p className="text-xs font-light">.doc, .docx, .pdf only</p>
    
  </div>
  <Button
        className="bg-[#758af0] w-40 rounded-lg h-8"
       disabled={loading}
       onClick={() => goToNextStep()}
      >
        {loading && (
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        )}
        {loading ? "Importing..." : "Import"}
      </Button>
      {fileName && (
        <p className="text-sm font-bold text-[#1336EA] ">
          Selected file: {fileName}
        </p>
      )}
    </div>
  </div>
  )
}

export default UploadPortifolio
