export interface IConvertRequestData {
    file: string;
    email_address: string;
    keys: Record<string, string>;
    delimiter: string;
}

export interface IConvertResponse {
    task_id: string;
    status: "processing" | "done" | "error"
}