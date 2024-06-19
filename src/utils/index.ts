export const fileListToBlob = (file: File) => {
    const blobs = [];
    blobs.push(file.slice(0, file.size, file.type));
    
    return new Blob(blobs);
}