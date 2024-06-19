import { api } from "@/api/api";
import { ENDPOINT_CONVERT } from "@/constants/endpoints";
import { IConvertRequestData, IConvertResponse } from "@/interfaces/convert";

export async function sendConvertDataGCS(data : IConvertRequestData) : Promise<IConvertResponse | null> {
    return new Promise<IConvertResponse | null>(async (resolve, reject) => {
        try {
            await api.post(ENDPOINT_CONVERT, data).then(response => {
                resolve(response.data);
            });
        } catch (e) {
            console.error('[PROMISE ERROR]: ' + e);
            reject(null);
        }
    })
}