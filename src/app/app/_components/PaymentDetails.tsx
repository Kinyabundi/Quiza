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


interface PersonalDetailsProps {
	goToPreviousStep: () => void;
	goToNextStep: () => void;
}

const personalDetailsSchema = object({
  name: string().required('Name is required')
})


const PaymentDetails = ({ goToPreviousStep, goToNextStep }: PersonalDetailsProps) => {
  const formMethods = useForm({ resolver: yupResolver(personalDetailsSchema) });
  const { handleSubmit, reset, control } = formMethods;
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const contractAddress = process.env.CONTRACT_ADDRESS!;


  // Initialize the Smart Account Client
  const {client} = useSmartAccountClient({
      type: "MultiOwnerModularAccount",
  });

  const {
      sendUserOperation,
      sendUserOperationResult,
      isSendingUserOperation,
      error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });


  const onSubmit = async () => {
    const id = toast.loading("Sending user operation...");
    setLoading(true);
    try {
        
        // Using `encodeFunctionData` from `viem`
        const uoCallData = encodeFunctionData({
            abi: profileABI,
            functionName: 'addPaymentDetails',
            args: [user?.address]
        });
        
        console.log(uoCallData)
       
        const uoResponse = await sendUserOperation({
              uo: {
                target: '0x550E63385Cc85B2d565D96a9E61eBA47642d1DAb',
                data: uoCallData,
              }
            }, {
                onSuccess: ({ hash }) => {
                    toast.success("Account Created")
            toast.dismiss(id)
                console.log(hash); 
                goToNextStep()
            },
            onError: (error) => {
                toast.error("Failed to Created Account",)
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
    <form className="flex flex-col  gap-8 w-full max-w-xs" onSubmit={onSubmit}>
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
      <Button type="submit">Add</Button>
    </div>
  </form>
  )
}

export default PaymentDetails
