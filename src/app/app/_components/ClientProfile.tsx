"use client";

import Stepper, { StepItem } from "@/components/stepper";
import useSteps from "@/hooks/useSteps";
import PersonalDetails from "./PersonalDetails";
import PaymentDetails from "./PaymentDetails";
import UploadPortifolio from "./UploadPortifolio";
import SelectIndustry from "./SelectIndustry";
import Finish from "./GoToDashBoard";
import { Button } from "@nextui-org/react";


const steps: StepItem[] = [
    {
        title: "Choose Industry",
    },
    {
        title: "Personal Details",
    },
    {
        title: "PaymentDetails",
    },
    {
        title: "Go To Dashboard"
    }

];


const GetStarted = () => {
    const { activeStep, goToNextStep, goToPreviousStep } = useSteps({
        initialStep: 0,
        count: steps.length,
    });

    return (
        <>
            <Stepper steps={steps} index={activeStep} />
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center justify-center bg-[#FFFFFF] border rounded-xl w-full lg:w-1/2 mx-auto space-y-4 p-8">
                    <div className="px-1 pt-8 flex flex-col items-center justify-center w-full">
                        {activeStep === 0 && (
                            <SelectIndustry goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />
                        )}

                        {activeStep === 1 && (
                            <PersonalDetails goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} role="Client" />
                        )}
                        {activeStep === 2 && (
                            <PaymentDetails goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />
                        )}
                        {activeStep === 3 && (
                            <Finish />
                        )}
                        <div className="flex flex-row mt-6 gap-3 justify-between">
                            <Button className="rounded-r-full rounded-bl-full justify-start border " onClick={goToPreviousStep} type="button">
                                Back
                            </Button>
                            <Button className="rounded-r-full rounded-bl-full justify-end border" onClick={goToNextStep} type="button">
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default GetStarted;