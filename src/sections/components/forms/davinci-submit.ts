import { useState } from 'react';

const useDavinciSubmit = () => {
    const [openAIResponse, setOpenAIResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);  // Add a loading state

    const davinciSubmit = async (prompt: string, maxTokens: number) => {
        setIsLoading(true); // Set loading to true when the request starts
        try {
            const response = await fetch('/api/davinci', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    maxTokens,
                }),
            });

            const data = await response.json();

            if (data.content) {
                setOpenAIResponse(data.content);
            } else {
                console.error("Failed to get documents.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setIsLoading(false); // Set loading to false when the request completes or fails
        }
    };

    return { davinciSubmit, openAIResponse, isLoading };  // Return the loading state along with other states
};

export default useDavinciSubmit;
