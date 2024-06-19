import { ENUM_CSV_DEMILITERS, ENUM_XES_KEYS } from "@/constants/enum";
import { MAX_FILE_SIZE } from "@/constants/forms";
import { isEmpty } from "lodash";
import { z } from "zod";

const CSV_DELIMITERS = ENUM_CSV_DEMILITERS.map(i => i.value) as [string, ...string[]];
const XES_KEYS = ENUM_XES_KEYS.map(i => i.value) as [string, ...string[]];
const ACCEPTED_MIME_TYPES = ["text/csv"] as [string, ...string[]];

export const KeysSchema = z.object({
    key: z.enum(XES_KEYS).or(z.string().min(1, { message: "field_must_be_filled" })),
    value: z.string().min(1, { message: "field_must_be_filled" })
})

export const SchemaXesConverter = z.object({
    email_address: z.string().min(1, { message: "field_must_be_filled" }).email("not_valid_email"),
    file: typeof window === 'undefined' ? z.undefined() : z.instanceof(FileList).optional(),
    delimiter: z.enum(CSV_DELIMITERS),
    keys: z.array(KeysSchema)
}).superRefine(({ file }, ctx) => {
    if (isEmpty(file)) {
        ctx.addIssue({
            code: "custom",
            message: "file_is_required",
            path: ["file"],
        })
    }

    if (file && !isEmpty(file) && !ACCEPTED_MIME_TYPES.includes(file[0].type)) {
        ctx.addIssue({
            code: "custom",
            message: "file_must_be_csv",
            path: ["file"],
        })
    }

    if (file && !isEmpty(file) && file[0].size > MAX_FILE_SIZE) {
        ctx.addIssue({
            code: "custom",
            message: `file_max_size`,
            path: ["file"],
        })
    }
});

export const SchemaXesConverterDefaultValues : z.infer<typeof SchemaXesConverter> = {
    email_address: '',
    file: undefined,
    delimiter: ENUM_CSV_DEMILITERS[0].value,
    keys: ENUM_XES_KEYS.map(item => ({
        key: item.value,
        value: ''
    }))
}

export const SchemaXesConverterSubmit = z.object({
    file: z.string().url().min(1, { message: 'field_must_be_filled' }),
    email_address: z.string().email().min(1, { message: 'field_must_be_filled' }),
    keys: z.record(z.string().min(1, { message: "field_must_be_filled" })),
    delimiter: z.literal(",").or(z.literal(";"))
});