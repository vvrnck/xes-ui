import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENUM_CSV_DEMILITERS } from "@/constants/enum";
import { cn } from "@/libs/shadcn/utils";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { SchemaXesConverter } from "./schema";
import { z } from "zod";

const FormFile : React.FC = () => {

    const t = useTranslations();
    const form = useFormContext<z.infer<typeof SchemaXesConverter>>();

    const watchedFile = form.watch("file");

    return (
        <>
            <fieldset className="field-item">
                <FormField
                    control={form.control}
                    name={"file"}
                    render={({ field }) => {
                        const fileName = watchedFile && watchedFile[0] ? watchedFile[0].name : 'No file choosen';

                        return (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor='file'>{t(field.name, { ns: 'form' })}</FormLabel>
                                <FormControl>
                                    <Input
                                        id="file"
                                        placeholder={t(field.name, { ns: 'form' })}
                                        type={"file"}
                                        accept="text/csv"
                                        disabled={field.disabled}
                                        className='hidden'
                                        onChange={(event) => {
                                            field.onChange(event.target.files)
                                            form.trigger('file');
                                        }}
                                    />
                                </FormControl>
                                <div
                                    className={cn(
                                        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                                        "items-center cursor-pointer gap-2"
                                    )}
                                    onClick={() => {
                                        const fileInput = document.getElementById("file");
                                        if (!fileInput) return null;
                                        fileInput.click();
                                    }} 
                                >
                                    <span className='w-[100px]'>
                                        <b>Choose File</b>
                                    </span>
                                    <span className='flex items-center w-full h-full overflow-hidden'>{fileName}</span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
            </fieldset>
            <fieldset className="field-item">
                <FormField
                    control={form.control}
                    name={`delimiter`}
                    render={({ field }) => {
                        return (
                            <FormItem className="space-y-2">
                                <FormLabel>{t(field.name, { ns: 'form' })}</FormLabel>
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
                                        {ENUM_CSV_DEMILITERS.map(option => (
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
        </>
    )
}

export default FormFile;