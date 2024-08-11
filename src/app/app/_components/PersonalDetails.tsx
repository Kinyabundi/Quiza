

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import React, { FormEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InferType, object, string } from "yup";
import { ethers } from 'ethers';
import { useSendUserOperation, useSignMessage, useSmartAccountClient } from "@alchemy/aa-alchemy/react";
import { encodeFunctionData } from 'viem';
import {
    chain,
    accountType,
    gasManagerConfig,
    accountClientOptions as opts,
} from "@/lib/config";
import toast from "react-hot-toast";
import { Controller } from 'react-hook-form';
import { useChain } from "@alchemy/aa-alchemy/react";
import {profileABI} from "@/abi/profileAbi"

// Define the schema for personal details validation
const personalDetailsSchema = object({
    name: string().required('Name is required'),
    phone: string().matches(/^[0-9]+$/, 'Phone number must only contain numbers').required('Phone number is required'),
}).required();

interface PersonalDetailsProps {
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    role: "Freelancer" | "Client";
}

const PersonalDetails = ({ goToPreviousStep, goToNextStep, role }: PersonalDetailsProps) => {
    const { chain, setChain } = useChain();
    const formMethods = useForm({ resolver: yupResolver(personalDetailsSchema) });
    const { handleSubmit, reset, control } = formMethods;
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

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



    const onSubmit = async (data: InferType<typeof personalDetailsSchema>) => {
        const id = toast.loading("Sending user operation...");
        setLoading(true);
        try {
            const payload = {
                name: data.name,
                phone: data.phone,
                email: user?.email,
            }
            console.log(chain)

            const roleMapping = {
               Client: 0,
               Freelancer: 1,
            };

            const numericRole = roleMapping[role];
    

            // Using `encodeFunctionData` from `viem`
            const uoCallData = encodeFunctionData({
                abi: profileABI,
                functionName: 'createProfile',
                args: [data.name, user?.email, data.phone, numericRole]
            });
            
            console.log(uoCallData)
           
            const uoResponse = await sendUserOperation({
                  uo: {
                    target: '0xFB237BC38372A9F2C53BB7Bc996C4fcb9B5b9c47',
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
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full max-w-xs">
                <div className="text-[18px] font-semibold mb-4">
                    Personal Details
                </div>
                <div className="flex flex-col justify-between gap-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={user?.email}
                        readOnly
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />

                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter your Name"
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <Input
                                type="tel"
                                placeholder="Enter your PhoneNumber"
                                {...field}
                            />
                        )}
                    />
                    
                    <Button type="submit" disabled={isSendingUserOperation}>
                    {isSendingUserOperation ? "Creating..." : "Create Account"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default PersonalDetails;
