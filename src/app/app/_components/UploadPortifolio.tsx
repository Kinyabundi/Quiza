import { Button } from '@/components/ui/button';
import { useSendUserOperation, useSmartAccountClient } from '@alchemy/aa-alchemy/react';
import { Loader2, UploadCloud } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { profileABI } from '@/abi/profileAbi';
import toast from 'react-hot-toast';
import { encodeFunctionData } from 'viem';


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

  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
  });
  
  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });
  

  const uploadFile = async () => {
    if (!file) {
      return;
    }
  
    const id = toast.loading("Uploading...");
    setLoading(true);
    try {
      // Using `encodeFunctionData` from `viem`
      const uoCallData = encodeFunctionData({
        abi: profileABI,
        functionName: 'uploadPortfolio',
        args: [file.name]
      });

      console.log(uoCallData)

      const uoResponse = await sendUserOperation({
        uo: {
          target: '0xFB237BC38372A9F2C53BB7Bc996C4fcb9B5b9c47',
          data: uoCallData,
        }
      }, {
        onSuccess: ({ hash }) => {
          toast.success("Uploaded Successfully")
          console.log(hash);
          goToNextStep()
        },
        onError: (error) => {
          toast.error("Failed to Upload")
          console.error(error);
        },
      });
  } catch (error) {
    console.error("Detailed Error" ,error)
} finally {
    setLoading(false)
}
  }

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
          onClick={() => uploadFile()}
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
