

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import React, { FormEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InferType, object, string } from "yup";
import { ethers } from 'ethers';
import { useSendUserOperation, useSignMessage, useSmartAccountClient, useWaitForUserOperationTransaction } from "@alchemy/aa-alchemy/react";
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

// Define the schema for personal details validation
const personalDetailsSchema = object({
    name: string().required('Name is required'),
    phone: string().matches(/^[0-9]+$/, 'Phone number must only contain numbers').required('Phone number is required'),
}).required();

interface PersonalDetailsProps {
    goToPreviousStep: () => void;
    goToNextStep: () => void;
}

const PersonalDetails = ({ goToPreviousStep, goToNextStep }: PersonalDetailsProps) => {
    const { chain, setChain } = useChain();
    const formMethods = useForm({ resolver: yupResolver(personalDetailsSchema) });
    const { handleSubmit, reset, control } = formMethods;
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    // Initialize the Smart Account Client
    const {client} = useSmartAccountClient({
        type: "MultiOwnerModularAccount",
    });

    // const { client } = useSmartAccountClient({
    //     type: accountType,
    //     // gasManagerConfig,
    //     // opts,
    // });
    const {
        sendUserOperation,
        sendUserOperationResult,
        isSendingUserOperation,
        error: isSendUserOperationError,
    } = useSendUserOperation({ client, waitForTxn: true });

    const ABI = [ 
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "paymentDetails",
                    "type": "string"
                }
            ],
            "name": "PaymentDetailsAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "portfolioHash",
                    "type": "string"
                }
            ],
            "name": "PortfolioUploaded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                }
            ],
            "name": "ProfileCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "newScore",
                    "type": "uint256"
                }
            ],
            "name": "ReputationUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_paymentDetails",
                    "type": "string"
                }
            ],
            "name": "addPaymentDetails",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_phoneNumber",
                    "type": "string"
                }
            ],
            "name": "createProfile",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getUserProfile",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "incrementJobCount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_newScore",
                    "type": "uint256"
                }
            ],
            "name": "updateReputation",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_portfolioHash",
                    "type": "string"
                }
            ],
            "name": "uploadPortfolio",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "userProfiles",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "phoneNumber",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "userAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "reputationScore",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "jobsCompleted",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "portfolioHash",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

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

            // Using `encodeFunctionData` from `viem`
            const uoCallData = encodeFunctionData({
                abi: ABI,
                functionName: 'createProfile',
                args: [data.name, user?.email, data.phone]
            });
            const testCallData = encodeFunctionData({
                abi: ABI,
                functionName: 'createProfile',
                args: ["Christine", "christine@kotanipay.com", "0769686091"] 
            });
            console.log("testCall", testCallData); 
            
            console.log(uoCallData)
           
            const uoResponse = await sendUserOperation({
                  uo: {
                    target: '0x55E4A812a7Cf4E315F5D38D8573F5f910D853e83',
                    data: uoCallData,
                  }
                }, {
                    onSuccess: ({ hash }) => {
                        toast.success("Account Created")
                    console.log(hash); // This is the transaction hash
                    // Optionally, wait for the transaction to be mined here if needed
                    // Example: const receipt = await ethers.provider.waitForTransaction(hash);
                    // Note: You need to replace `ethers.provider` with your actual provider instance
                },
                onError: (error) => {
                    toast.error("Failed to Created Account")
                    console.error(error);
                },
                });

        } catch (error) {
            console.error("Detailed Error" ,error)
        } finally {
            setLoading(false)
            toast.dismiss(id)
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
