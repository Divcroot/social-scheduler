import axios from "axios";

export const pollLeonardoJob = async (generationId : string, apiKey : string) : Promise<string> => {
    const maxRetries = 20;
    const delay = 5000;

    for(let i = 0; i < maxRetries; i++){
        try {
            const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {headers: {
                accept: "application/json",
                authorization: `Bearer ${apiKey}`,
            }})

            const generation = response.data.generations_by_pk;

            if(generation.status === 'COMPLETE'){
                if(generation.generated_images && generation.generated_images.length > 0){
                    return generation.generated_images[0].url
                }

                throw new Error("Generation complete but no images found.");
            }

            if(generation.status === 'FAILED'){
                throw new Error("Leonardo.ai generation failed.")
            }
        } catch (error : any) {
            console.error("Polling error: ", error?.response?.data || error.message);
        }
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    throw new Error("Leonardo.ai generation polling timed out after maximum retries.");
}