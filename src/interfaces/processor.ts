export interface IProcessorSignedResponse {
    url: string;
}

export interface IProcessorRequest {
    file_name: string;
    mime_type: string;
    is_resumable: boolean;
}