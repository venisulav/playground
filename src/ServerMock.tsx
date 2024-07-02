export type GetResourceResponse = {
    found: boolean
    type ?: "FILE" | "FOLDER"
}

const MOCK_API_MEAN_DURATION_MS = 500;

/**
 * The mock impletation instead of the fetch api.
 * It does a random sleep and generates a random response at the client.
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
    await new Promise(r => setTimeout(r, MOCK_API_MEAN_DURATION_MS * randomSeed));
    return response;
}