import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext';
import { useSendUserOperation, useSmartAccountClient } from '@alchemy/aa-alchemy/react';
import React, { FormEvent, useCallback, useState } from 'react'
import { InferType, object, string } from "yup";
import { FormProvider, useForm } from 'react-hook-form';
import { encodeFunctionData } from 'viem';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { profileABI } from '@/abi/profileAbi';
import {
  chain,
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
} from "@/lib/config";
import { Loader2 } from 'lucide-react';


interface PaymenetsDetailsProp {
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

const PaymentDetails = ({ goToPreviousStep, goToNextStep }: PaymenetsDetailsProp) => {
 
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const contractAddress = process.env.CONTRACT_ADDRESS!;


  // Initialize the Smart Account Client
  const { client } = useSmartAccountClient({
    type: "MultiOwnerModularAccount",
    gasManagerConfig,
    opts,
  });

  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });


  const onSubmit = async () => {
    const id = toast.loading("Adding Payments...");

    try {
      setLoading(true);

      const uoCallData = encodeFunctionData({
        abi: profileABI,
        functionName: 'addPaymentDetails',
        args: [user?.address]
      });

      console.log(uoCallData)

      const uoResponse = await sendUserOperation({
        uo: {
          target: '0x1988B6eD414f0becE93945086DE8E8269D22ce9e',
          data: uoCallData,
        }
      }, {
        onSuccess: ({ hash }) => {
          toast.success("Added successfully");
          console.log(hash);
          setLoading(false);
          toast.dismiss(id);
          goToNextStep();
        },
        onError: (error) => {
          toast.error("Failed to add payment");
          console.error(error);
          setLoading(false);
          toast.dismiss(id);
        },
      });
    } catch (error) {
      console.error("Detailed Error", error)
      setLoading(false);
      toast.dismiss(id);
    } finally {
      setLoading(false)
      toast.dismiss(id)

    }
  }
  return (
    // <form className="flex flex-col  gap-8 w-full max-w-xs" onSubmit={onSubmit}>
    <>
      <div className="text-[18px] font-semibold mb-4">
        Payment Details
      </div>
      <div className="flex flex-col justify-between gap-6">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Wallet Address
        </label>
        <Input
          type="address"
          readOnly
          value={user?.address}
        />
        <Button onClick={() => onSubmit()}>
        {isSendingUserOperation && (
           <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        )}
        {isSendingUserOperation ? "Adding Payments Details" : "Add"}
        </Button>
      </div>
      </>
    // </form>
  )
}

export default PaymentDetails
