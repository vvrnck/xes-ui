import { api } from "@/api/api";
import Alert from "@/classes/Alert";
import { ALERT_ERROR } from "@/constants/alerts";
import { ENDPOINT_PROCESSOR_SIGNED } from "@/constants/endpoints";
import { IProcessorRequest, IProcessorSignedResponse } from "@/interfaces/processor";

const AlertInstance = new Alert();

export async function getProcessorSignedLink({ file_name, mime_type, is_resumable } : IProcessorRequest) : Promise<IProcessorSignedResponse> {
    return new Promise<IProcessorSignedResponse>(async (resolve, reject) => {
        try {
            const bodyData = {
                file_name,
                mimetype: mime_type,
                is_handshake: is_resumable
            }
            await api.post(ENDPOINT_PROCESSOR_SIGNED, bodyData).then(response => {
                resolve(response.data);
            });
        } catch (e) {
            console.error(e);
            AlertInstance.alert(ALERT_ERROR, 'error_api');
            reject(null);
        }
    });
}