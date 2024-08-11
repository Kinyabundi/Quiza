import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext';
import React, { FormEvent, useCallback, useState } from 'react'

interface PersonalDetailsProps {
	goToPreviousStep: () => void;
	goToNextStep: () => void;
}


const PersonalDetails = ({ goToPreviousStep, goToNextStep }: PersonalDetailsProps) => {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [],
  );

  const { user } = useAuth(); 

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setLoading(true)
    goToNextStep()

  };
  return (
    <form className="flex flex-col  gap-8 w-full max-w-xs" onSubmit={handleSubmit}>
    <div className="text-[18px] font-semibold mb-4">
    Personal Details
    </div>
    <div className="flex flex-col justify-between gap-6">
      <Input
        type="address"
        value={user?.address}
      />
       <Input
        type="Phone No"
        placeholder="Enter your PhoneNumber"
        value={phone}
      />
      <Button type="submit">Add</Button>
    </div>
  </form>
  )
}

export default PersonalDetails
