'use client';

import { Button } from '@/components/ui/button';
import { IStepperProps } from '@/interfaces/stepper';
import { LucideArrowLeft, LucideArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PropsWithChildren, useState } from 'react';

const useStepper = (initialStep: number, steps: Array<string>): IStepperProps => {
    const [currentStep, setCurrentStep] = useState(initialStep);

    const totalSteps = steps.length;

    const goToNextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 0 && step < totalSteps) {
            setCurrentStep(step);
        }
    };

    const reset = () => {
        setCurrentStep(initialStep);
    };

    return {
        currentStep,
        steps,
        totalSteps,
        goToNextStep,
        goToPrevStep,
        goToStep,
        reset,
    };
};

type TProps = {
    showHeader?: boolean;
    showButtons?: boolean;
    stepper: IStepperProps;
}

const Stepper: React.FC<TProps & PropsWithChildren> = ({ stepper, showHeader = true, children, showButtons = true }) => {

    const t = useTranslations();
    const { currentStep, totalSteps, steps, goToNextStep, goToPrevStep, goToStep, reset } = stepper;


    return (
        <>
  
            {!showHeader && currentStep !== 0 && 
                <div className='flex justify-start p-2'>
                    <Button
                        size={"icon"}
                        variant={"ghost"}
                        disabled={currentStep === 0}
                        onClick={(e) => {
                            e.preventDefault();
                            goToPrevStep();
                        }}
                    > 
                        <LucideArrowLeft className='w-5 h-5' />
                    </Button>
                </div>
            }

            {showHeader &&
                <div className="flex justify-between gap-2 py-2">
                    <div className='flex justify-between items-center w-full'>
                        <h3 className="text-md font-semibold flex items-center">
                            {steps[currentStep]}
                        </h3>
                        
                        <span>
                            {currentStep + 1} {t('of')} {totalSteps}
                        </span>
                    </div>
                    {showButtons &&
                        <div className='flex gap-2'>    
                            <Button
                                type='button'
                                size={"icon"}
                                disabled={currentStep === 0}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToPrevStep();
                                }}
                            > 
                                <LucideArrowLeft className='w-5 h-5' />
                            </Button>
                            <Button
                                type='button'
                                size={"icon"}
                                disabled={currentStep === totalSteps - 1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToNextStep();
                                }}
                            > 
                                <LucideArrowRight className='w-5 h-5' />
                            </Button>
                        </div>
                    }
                </div>
            }

            <section className='mt-2'>
                {children}
            </section>
        </>
    );
};


export default useStepper;

export { Stepper };
