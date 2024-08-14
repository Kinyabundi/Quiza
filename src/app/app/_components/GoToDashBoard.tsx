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
import { useRouter } from 'next/navigation';


const Finish = () => {

  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()


  const onSubmit = async () => {
    router.push("/app/client/dashboard");
}
  return (
 
    <div className="flex flex-col justify-between gap-6">
    <Button onClick={() => onSubmit()}>Go To Dashboard</Button>
    </div>
  )
}

export default Finish
