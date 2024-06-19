import Alert from "@/classes/Alert";
import { ALERT_ERROR } from "@/constants/alerts";
import { isEmpty } from "lodash";

const AlertInstance = new Alert();

export async function uploadToGCS(url: string, file : any, mime_type: string) : Promise<Boolean | string> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const xhttp = new XMLHttpRequest();
            //Send the proper header information along with the request
            xhttp.open("PUT", url, true);

            xhttp.setRequestHeader('Content-type', mime_type);
            
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:
                    const response = !isEmpty(this.responseURL) ? this.responseURL : true;
                    resolve(response);
                }
            };

            xhttp.onerror = function() {
                reject(false)
            }
            
            xhttp.send(file);  /* Send to server */ 
        } catch (e) {
            console.error(e);
            AlertInstance.alert(ALERT_ERROR, 'error_api');
            reject(false);
        }
    });
}

export async function uploadInChunksToGCS(url: string, file: File, mime_type: string, onProgress: (progress: number) => void): Promise<Boolean | string> {
    const CHUNK_SIZE = 1024 * 1024 * 50; // 100MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedBytes = 0;

    const initiateResumableUpload = async (): Promise<string> => {
        const xhttp = new XMLHttpRequest();
        return new Promise<string>((resolve, reject) => {
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader('Content-Type', mime_type);
            xhttp.setRequestHeader('x-goog-resumable', "start");
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 201) {
                        const location = xhttp.getResponseHeader('Location');
                        if (location) {
                            resolve(location);
                        } else {
                            reject(new Error("Location header not found in response"));
                        }
                    } else {
                        reject(new Error("Failed to initiate resumable upload"));
                    }
                }
            };
            xhttp.send();
        });
    };

    const uploadChunk = async (sessionUrl: string, chunk: Blob, start: number, end: number): Promise<void> => {
        const xhttp = new XMLHttpRequest();
        return new Promise<void>((resolve, reject) => {
            xhttp.open("PUT", sessionUrl, true);
            xhttp.setRequestHeader('Content-Range', `bytes ${start}-${end - 1}/${file.size}`);
            xhttp.setRequestHeader('Content-Type', mime_type);
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 308 || this.status === 200) {
                        uploadedBytes += chunk.size;
                        onProgress(Math.round((uploadedBytes / file.size) * 100));
                        resolve();
                    } else {
                        reject(new Error("Failed to upload chunk"));
                    }
                }
            };
            xhttp.send(chunk);
        });
    };

    const completeResumableUpload = async (sessionUrl: string): Promise<Boolean | string> => {
        const xhttp = new XMLHttpRequest();
        return new Promise<Boolean | string>((resolve, reject) => {
            xhttp.open("PUT", sessionUrl, true);
            xhttp.setRequestHeader('Content-Range', `bytes */${file.size}`);
            xhttp.setRequestHeader('Content-Type', mime_type);
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200 || this.status === 201) {
                        resolve(true);
                    } else {
                        reject(new Error("Failed to complete resumable upload"));
                    }
                }
            };
            xhttp.send();
        });
    };

    try {
        const sessionUrl = await initiateResumableUpload();
        
        for (let i = 0; i < totalChunks; i++) {
            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            await uploadChunk(sessionUrl, chunk, start, end);
        }

        return await completeResumableUpload(sessionUrl);
    } catch (error) {
        console.error(error);
        return false;
    }
}