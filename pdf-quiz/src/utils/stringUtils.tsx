export const parseAnswerChoices = (input: string): string[] => {
    const substrings = input.split(/[a-d]\)/i);
    return substrings
        .filter((substring) => substring.trim() !== "")
        .map((substring) => substring.trim());
};

export const splitQuestionAndAnswers = (questionAndAnswer: string): [string, string] => {
    const splitPair = questionAndAnswer.split("a)");
    if (!splitPair[1]) {
        const splitPairUppercase = questionAndAnswer.split("A)");
        const question = splitPairUppercase[0].split('?')[0] + "?";
        const answerString = "a)" + splitPairUppercase[1].replace("ANSWERS:", "");
        return [question, answerString];
    } else {
        const question = splitPair[0].split('?')[0] + "?";
        const answerString = ("a)" + splitPair[1]).replace("ANSWERS:", "");
        return [question, answerString];
    }
};

export const parseQuestionsAndAnswers = (rawText: string): string[] => {
    return rawText
        .substring(rawText.indexOf("1."))
        .replace(/\\n/g, "")
        .replace(/\\/g, "")
        .match(/(\d+\.\d*)\s?([\s\S]*?)(?=\d+\.|$)/g) || [];
};

