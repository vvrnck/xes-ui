import { Dispatch, SetStateAction } from "react";

export interface IStep {
    label: string;
    content: JSX.Element;
};

export type IStepperProps = {
    currentStep: number;
    totalSteps: number;
    steps: Array<string>;
    goToNextStep: () => void;
    goToPrevStep: () => void;
    goToStep: (step: number) => void;
    reset: () => void;
};