'use client'

import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { SchemaXesConverter, SchemaXesConverterDefaultValues, SchemaXesConverterSubmit } from "./schema";
import { z } from "zod";
import useStepper, { Stepper } from "@/hooks/useStepper";
import { toast } from "sonner";
import { useLoading } from "@/context/loading";
import { getProcessorSignedLink } from "@/services/processor";
import { uploadInChunksToGCS, uploadToGCS } from "@/services/gcs";
import { IConvertRequestData } from "@/interfaces/convert";
import { sendConvertDataGCS } from "@/services/convert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideArrowRight, LucideLoader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormEmail from "./FormEmail";
import FormFile from "./FormFile";
import FormKeyRelation from "./FormKeyRelation";
import { useState } from "react";

const FormConverter : React.FC = () => {
    
    const [uploading, setUploading] = useState<boolean>();
    const [progress, setProgress] = useState<number>(0);

    const t = useTranslations();
    const { loading, setLoading } = useLoading();

    const form = useForm<z.infer<typeof SchemaXesConverter>>({
        resolver: zodResolver(SchemaXesConverter),
        defaultValues: SchemaXesConverterDefaultValues
    });

    const watchedFile = form.watch("file");

    const steps = [t('email_step'), t('file_step'), t('convert_step')];
    const stepper = useStepper(0, steps);

    const uploadFile = async (fileList: FileList) : Promise<null | void | string> => { // string is success, void (undefined) or null is fail
        if (!fileList || !fileList[0]) return null;
        
        const file = fileList[0];
        setUploading(true);

        try {
            const file_name = file.name;
            const mime_type = file.type;

            const processor = await getProcessorSignedLink({ file_name, mime_type, is_resumable: true }).catch((e) => {
                console.error("[ERROR]: PROCESSOR (SIGNED URL) ", e);
                toast(t("errors.error_uploading_file"), {
                    position: "top-right",
                    description: new Date().toString(),
                    action: {
                        label: t("close"),
                        onClick: () => null,
                    },
                });
            });

            if (!processor) return null;
            const { url } = processor;
            const result = await uploadInChunksToGCS(url, file, mime_type, setProgress);
    
            if (result === true) {
                const signed_url = url.split("?")[0];
                toast.success(t("success.success_send_file"));
                console.log("[SUCCESS]: GCS UPLOAD ", file_name);
                return signed_url; // only success outcome possible
            } else {
                toast(t("errors.error_uploading_file"), {
                    position: "top-right",
                    description: new Date().toString(),
                    action: {
                        label: t("close"),
                        onClick: () => null,
                    },
                });
                console.error("[FAIL]: GCS UPLOAD ", result);
            }
        } catch (error) {
            console.error("[ERROR]: GCS UPLOAD ", error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const checkEmailStep = async () => {
        if (stepper.currentStep !== 0) return;

        const hasErrorEmail = await form.trigger(["email_address"]); // await is necessary

        if (!hasErrorEmail && stepper.currentStep === 0) {
            toast(t("warning.warning_fill_email"), {
                position: "top-right",
                description: new Date().toString(),
                action: {
                    label: t("close"),
                    onClick: () => null,
                },
            });
            return;
        }

        stepper.goToNextStep();
    }

    const checkFileStep = async () => {
        if (stepper.currentStep !== 1) return;

        const isOkFile = await form.trigger(["file"]);
        
        if (!isOkFile && stepper.currentStep === 1) {
            const hasFile = watchedFile && watchedFile[0] ? watchedFile[0].name : undefined;
            const message = hasFile ? 'warning.warning_upload_file_correctly' : 'warning.warning_file_must_be_uploaded'
            toast(t(message), {
                position: "top-right",
                description: new Date().toString(),
                action: {
                    label: t("close"),
                    onClick: () => null,
                },
            });
            return;
        }
        
        form.clearErrors("file");

        stepper.goToNextStep();
    }

    const handleNextClick = async () => { // only valid to steps 1 and 2
        checkEmailStep();
        checkFileStep();
    }

    const onSubmit = async (values: z.infer<typeof SchemaXesConverter>) => {
        // no errors, upload resumable file in chunk here
        const file = form.getValues().file;
        if (!file) return;
        
        const fileSignedURL = await uploadFile(file);
        if (!fileSignedURL) {
            toast(t("warning.warning_send_file_data"), {
                position: "top-right",
                description: new Date().toString(),
                action: {
                    label: t("close"),
                    onClick: () => null,
                },
            });
            return;
        }
        
        // sending data after resumable upload
        setLoading(true);        
        const keys_relation = values.keys.reduce<{[key: string]: string}>((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {});

        const data : IConvertRequestData = {
            file: fileSignedURL,
            email_address: values.email_address,
            keys: keys_relation,
            delimiter: values.delimiter
        }
        
        // forcing assertion check on schema validation after transform data
        const validation = SchemaXesConverterSubmit.safeParse(data);
        if (!validation.success) {
            console.warn("[PARSE ERROR]: could not parse form data", validation);
            toast(t("errors.error_submit_form"), {
                position: "top-right",
                description: new Date().toString(),
                action: {
                    label: t("close"),
                    onClick: () => null,
                },
            });
            setLoading(false);
            return;
        }
        
        sendConvertDataGCS(data)
            .then(() => {
                toast.success(t("success.success_check_email"));
            })
            .catch(() => {
                toast.error(t("errors.error_sending_file"));
            })
            .finally(() => setLoading(false));
    }

    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
                    <div className='flex justify-center'>
                        <Card className='w-full p-3'>
                            <Stepper stepper={stepper} showHeader={false}>
                                {stepper.currentStep === 0 && <FormEmail />}
                                {stepper.currentStep === 1 && <FormFile />}
                                {stepper.currentStep === 2 && <FormKeyRelation />}
                            </Stepper>
                        </Card>
                    </div>


                    <div className='flex justify-center pt-5'>
                        {stepper.currentStep <= 1 ?     
                            <Button
                                id={"next__button"}
                                type={"button"}
                                className='w-full flex gap-1'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleNextClick();
                                }}
                                disabled={loading || uploading}
                            >
                                <span>{t('next')}</span>
                                <LucideArrowRight className='w-5 h-5' />
                            </Button>
                            :
                            <Button
                                type="submit"
                                className='w-full flex gap-1'
                                disabled={loading}
                            >
                                {uploading &&
                                    <>
                                        <span>{t('sending_file')}</span>
                                        <LucideLoader className='animate-spin w-5 h-5' />
                                        <span>({progress}%)</span>
                                    </>
                                }
                                {loading &&
                                    <>
                                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                                        {t('converting')}
                                    </>
                                }
                                {!loading && !uploading ? t('convert') : null}
                            </Button>
                        }
                        
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default FormConverter;