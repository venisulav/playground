export type GetResourceResponse = {
    found: boolean
    type ?: "FILE" | "FOLDER"
}

/**
 * The mock impletation instead of the fetch api.
 * It returns a random response directly at the client.
 */
export async function fetchResourceInfo(url: string): Promise<GetResourceResponse>{
    const randomSeed = Math.random();
    const found = randomSeed < 0.5;
    const response: GetResourceResponse = {
        found : found
    };
    if (found){
        response.type =  randomSeed < 0.25 ? "FILE" : "FOLDER";
    }
    await new Promise(r => setTimeout(r, 500 * randomSeed));
    return response;
}