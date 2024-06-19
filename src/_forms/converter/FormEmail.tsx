import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { SchemaXesConverter } from "./schema";
import { toast } from "sonner";

const FormEmail : React.FC = () => {

    const t = useTranslations();
    const form = useFormContext<z.infer<typeof SchemaXesConverter>>();

    const handleNextClick = async () => {
        const hasErrorEmail = await form.trigger(["email_address"]); // await is necessary

        if (!hasErrorEmail) {
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
        
        form.clearErrors("file");

        const nextButton = document.getElementById("next__button");
        if (!nextButton) return;

        nextButton.click();
    }

    return (
        <>
            <fieldset>
                <FormField
                    control={form.control}
                    name={"email_address"}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel>{t(field.name, { ns: 'form' })}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    placeholder={t(field.name, { ns: 'form' })}
                                    type={"email"}
                                    disabled={field.disabled}
                                    onKeyDown={(event) => {
                                        if (event.which == 13 || event.keyCode == 13 || event.key === "Enter") { // asure browsers compatibility
                                            event.preventDefault();
                                            event.stopPropagation();
                                            handleNextClick();
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </fieldset>
        </>
    )
}

export default FormEmail;