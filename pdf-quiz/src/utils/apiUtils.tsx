export const postRequest = async (category: string, body: string) => {
    try {
        const response = await fetch('http://localhost:3001/processQuiz', {
            method: "POST",
            body: JSON.stringify({
                category: category,
                pdfText: body
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error with POST request:', error);
        throw error;
    }
};