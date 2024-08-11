"use client";

import Stepper, { StepItem } from "@/components/stepper";
import useSteps from "@/hooks/useSteps";
import PersonalDetails from "./PersonalDetails";
import PaymentDetails from "./PaymentDetails";
import UploadPortifolio from "./UploadPortifolio";
import { Button } from "@nextui-org/react";

const steps: StepItem[] = [
  {
    title: "Personal Details",
  },
  {
    title: "Upload Portifolio",
  },
  {
    title: "PaymentDetails",
  },

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
        <div className="bg-[#FFFFFF] border rounded-xl w-full lg:w-1/2 space-y-4 p-8 flex items-center justify-center ">
          <div className="px-1 pt-8 flex flex-col items-center justify-center ">
            {activeStep === 0 && (
              <PersonalDetails goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} role="Freelancer" />
            )}
            {activeStep === 1 && (
              <UploadPortifolio goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />

            )}
            {activeStep === 2 && (
              <PaymentDetails goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />
            )}
            <div className="flex flex-row mt-6 gap-3 justify-between">
         <Button className="rounded-r-full rounded-bl-full justify-start border " onClick={goToPreviousStep} type="button">
						Back
					</Button>
          <Button  className="rounded-r-full rounded-bl-full justify-end border" onClick={goToNextStep} type="button">
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