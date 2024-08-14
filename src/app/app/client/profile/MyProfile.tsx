'use client';

import { useSendUserOperation, useSmartAccountClient } from '@alchemy/aa-alchemy/react';
import React, { useEffect } from 'react'
import {
  chain,
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
} from "@/lib/config";
import { useAuth } from '@/context/AuthContext';
import { ethers } from 'ethers';
import { profileABI } from '@/abi/profileAbi';
import { encodeFunctionData } from 'viem';
import { baseSepolia } from '@alchemy/aa-core';

const MyProfile = () => {
  const { user } = useAuth();

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

  
  
  const getUser = async () => {

    const params = {
      address: user?.address
    };


      const provider = new ethers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/jEqDwqSmkkqljpS_z42AzFhxfGYnCwwO')

    console.log(user?.address)

    const contract = new ethers.Contract("0x1988B6eD414f0becE93945086DE8E8269D22ce9e", profileABI, provider)
   


    const userDetails = await contract.getUserProfile(user?.address)

    console.log(userDetails)

  }

  useEffect(() => {
    getUser()
  }, [user])

  return (
    <div>
      My Profile
    </div>
  )
}

export default MyProfile
