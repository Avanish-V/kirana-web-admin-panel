import { api } from "./api";

export const uploadImage = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const { url } = await response.json();
    return url;
};
