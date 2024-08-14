'use client'

import React, { useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSendUserOperation, useSmartAccountClient } from '@alchemy/aa-alchemy/react';
import {
  chain,
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
} from "@/lib/config";
import { Controller } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { encodeFunctionData } from 'viem';
import { InferType, object, string } from "yup";
import { profileABI } from '@/abi/profileAbi';
import { ethers } from 'ethers';



const formSchema = object({
  document: string().required("Document link is required"),
  deadline: string().required("Deadline is required"),
  category: string().required("Category is required"),
  pay: string().required("pay is required")
});

const CreateJob = () => {
  const formMethods = useForm({ resolver: yupResolver(formSchema) });
  const { handleSubmit, control } = formMethods;
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

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



  const onSubmit = async (data: InferType<typeof formSchema>) => {
    console.log("starting...")
    const id = toast.loading("Creating a Job...");

    try {
      setLoading(true);

      const paymentAmount = ethers.parseEther("0.1"); 

      const uoCallData = encodeFunctionData({
        abi: profileABI,
        functionName: 'createJob',
        args: [data.document,data.deadline, data.category,  data.pay],
      });

      console.log(uoCallData)
    //   const contractAddress = process.env.CONTRACT_ADDRESS!;

      const uoResponse = await sendUserOperation({
        uo: {
          target: '0x1988B6eD414f0becE93945086DE8E8269D22ce9e',
          data: uoCallData,
          value: paymentAmount
        }
      }, {
        onSuccess: ({ hash }) => {
          toast.success("Job Posted")
          console.log(hash);
        },
        onError: (error) => {
          toast.error("Failed to  Post a Job",)
          console.error(error);
        },
      });

    } catch (error) {
      console.error("Detailed Error", error)
    } finally {
      setLoading(false)
      toast.dismiss(id)
    }
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center min-h-screen">

          <div className="bg-[#FFFFFF] border rounded-xl w-full lg:w-3/4 p-8 flex items-center justify-center ">

            <div className="px-1 pt-8 flex flex-col items-center justify-center  space-y-6 ">

              <div className="text-2xl font-bold  mb-4">
                Post A Job
              </div>
              <Controller
                control={control}
                name="document"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Provide a link to document"
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <Input
                    type="date"
                    placeholder="Provide a deadline"
                    {...field}
                  />
                )}
              />
                <Controller
                control={control}
                name="pay"
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Payment in USD"
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select {...field}>
                    <SelectTrigger className="w-[230px]">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="softwareEngineer">Software Engineer</SelectItem>
                      <SelectItem value="computerScience">Computer Science</SelectItem>
                      <SelectItem value="technicalWriting">Technical Writing</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Button type="submit" disabled={isSendingUserOperation}>
                {isSendingUserOperation ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateJob;