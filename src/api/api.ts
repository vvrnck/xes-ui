// api.ts
import axios from "axios";

const abortController = new AbortController();

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
    signal: abortController.signal,
});

export { api };
