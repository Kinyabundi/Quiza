import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext';
import React, { FormEvent, useCallback, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface PersonalDetailsProps {
    goToPreviousStep: () => void;
    goToNextStep: () => void;
}


const SelectIndustry = ({ goToPreviousStep, goToNextStep }: PersonalDetailsProps) => {
    const [loading, setLoading] = useState<boolean>(false);


    const { user } = useAuth();

    const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setLoading(true)
        goToNextStep()

    };
    return (
        <form className="flex flex-col  gap-8 w-full max-w-xs" onSubmit={handleSubmit}>
            <div className="text-[18px] font-semibold mb-4">
                Select Industry
            </div>
            <div className="relative flex flex-col justify-between gap-6">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Software Engineer " />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Software Engineer </SelectItem>
                        <SelectItem value="dark">Computer Science</SelectItem>
                        <SelectItem value="system"> Technical Writering</SelectItem>
                        <SelectItem value="Medicine">Medicine</SelectItem>
                    </SelectContent>
                </Select>

            </div>
            <Button type="submit">Add</Button>

        </form>
    )
}

export default SelectIndustry
