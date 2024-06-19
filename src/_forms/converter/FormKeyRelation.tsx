import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENUM_XES_KEYS } from "@/constants/enum";
import { LucideTrash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { SchemaXesConverter } from "./schema";
import { useLoading } from "@/context/loading";

const FormKeyRelation : React.FC = () => {

    const t = useTranslations();
    const { loading } = useLoading();
    const form = useFormContext<z.infer<typeof SchemaXesConverter>>();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'keys',
    });

    return (
        <>
            <section className="grid col-span-3 gap-3">
                <FormLabel>{t("keys_relation", { ns: 'form' })}</FormLabel>
                {fields.map((f, index) => (
                    <section key={f.id} className="flex w-full gap-3">
                        <fieldset className="field-item w-[200px]">
                            <FormField
                                control={form.control}
                                name={`keys.${index}.key`}
                                render={({ field }) => {
                                    if (index > 2) {
                                        return (
                                            <FormItem className="space-y-2">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={t("key", { ns: 'form' })}
                                                        type={"text"}
                                                        disabled={field.disabled}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }

                                    return (
                                        <FormItem className="space-y-2">
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                                disabled={field.disabled}
                                            >
                                                <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`${field.name}`} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {ENUM_XES_KEYS.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {t(option.label, { ns: 'form' })}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )    
                                    }}
                            />
                        </fieldset>
                        <fieldset className="field-item flex-grow">
                            <FormField
                                control={form.control}
                                name={`keys.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        {/* <FormLabel>{t(formData.defaultValues.keys[index]., { ns: 'form' })}</FormLabel> */}
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={t("value", { ns: 'form' })}
                                                type={"text"}
                                                disabled={field.disabled}
                                                value={field.value}
                                                //required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </fieldset>
                        <i className="flex flex-col-reverse flex-shrink self-start">
                            <Button 
                                size={"icon"} 
                                variant="outline"
                                className={`p-2 w-9 h-9`} 
                                onClick={() => remove(index)} 
                                title={"remove"}
                                disabled={index <= 2 || loading}
                            >
                                <LucideTrash className="w-10 h-10" />
                            </Button>
                        </i>
                    </section>
                ))}
                        
                <div className="block">
                    <Button 
                        type="button" 
                        className="w-full" 
                        onClick={() => append({ key: '', value: '' })}
                        disabled={loading}
                    >
                        {t("add_key", { ns: 'form' })}
                    </Button>
                </div>
            </section>
        </>
    )
}

export default FormKeyRelation;