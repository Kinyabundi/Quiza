"use client";

import Stepper, { StepItem } from "@/components/stepper";
import useSteps from "@/hooks/useSteps";
import PersonalDetails from "./PersonalDetails";
import PaymentDetails from "./PaymentDetails";
import UploadPortifolio from "./UploadPortifolio";

const steps: StepItem[] = [
  {
    title: "Upload CV",
  },
  {
    title: "Personal Details",
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
    <div className="bg-[#FFFFFF] border rounded-xl w-full lg:w-1/2 space-y-4 p-8 flex items-center justify-center ">
    <div className="px-1 pt-8  flex items-center justify-center ">
        {activeStep === 0 && (
        <UploadPortifolio goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />
        )}

        {activeStep === 1 && (
         <PersonalDetails goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />
        )}
        {activeStep === 2 && (
          <PaymentDetails goToPreviousStep={goToPreviousStep} goToNextStep={goToNextStep} />
        )}
      </div>
    </div>
    </>
  )
};

export default GetStarted;