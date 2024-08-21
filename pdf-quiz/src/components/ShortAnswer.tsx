import React, { useState, useEffect, useCallback, useRef } from "react";
import { postRequest } from '../utils/apiUtils';
import { parseQuestionsAndAnswers } from '../utils/stringUtils';

import '../styles/Quiz.css';

interface Props {
    text: string;
    title: string;
}

const ShortAnswer: React.FC<Props> = ({ text, title }) => {
    const [quiz, setQuiz] = useState("Loading, please wait...");
    const [questions, setQuestions] = useState<string[]>([]);
    const [finalGrade, setFinalGrade] = useState(["Loading"]);
    const [correctAnswers, setCorrectAnswers] = useState("");
    const [percentage, setPercentage] = useState(0);

    const formattedTitle = title.substring(0, title.length - 4);
    const questionRefs = useRef<(HTMLInputElement | null)[]>([]);


    const convertQuizToLinks = async (rawText: string) => {
        const questionsAndAnswers = parseQuestionsAndAnswers(rawText);

        let separateQuestions: string[] = [];
        let separateAnswers: string[] = [];

        if (questionsAndAnswers) {
            for (let i = 0; i < questionsAndAnswers.length; i++) {
                let splitPair = questionsAndAnswers[i].split("Answer:");
                separateQuestions[i] = splitPair[0].split('?')[0] + "?";
                separateAnswers[i] = splitPair[1];
            }
        }
        const separateResponses = separateQuestions.slice(5).join(",");

        setQuestions(separateQuestions.slice(0, 5));
        setCorrectAnswers(separateResponses);
    };

    const getQuiz = async () => {
        const rawQuizText = await postRequest("short-answer", text)
        const textData = await rawQuizText.text();
        await convertQuizToLinks(textData);
        setQuiz("quiz ready");
    };

    const gradeQuiz = async () => {
        let correctAnswersProvided = "CORRECT ANSWERS: " + correctAnswers.toString();
        let output = "USER ANSWERS: " + questionRefs.current.map(ref => ref?.value ?? "").join(", ");
        const rawQuizText = await postRequest("grade-quiz", questions.toString() + correctAnswersProvided + output)

        const textData = await rawQuizText.json();
        const formattedResponse = textData[0].text.split('\n').filter((line: string) => line.trim() !== '');
        console.log(formattedResponse);

        setFinalGrade(formattedResponse);
        const extractedPercentage = textData[0].text.match(/(\d{1,3}(\.\d+)?)%/);
        console.log("percentage:" + extractedPercentage);
        setPercentage(extractedPercentage[0]);
    };

    useEffect(() => {
        console.log("Short-Answer Quiz");
        getQuiz();
    }, []);

    return (
        <div>
            <h3>Short-Answer Quiz on <b>{formattedTitle}</b>
            </h3>

            {quiz === "Loading, please wait..." ? (
                <p className="h1">{quiz}</p>
            ) : (
                <div className="question-container">
                    {questions.map((question, index) => (
                        <div key={index} >
                            <p className="question-text">{question}</p>
                            <label className="answer-text">
                                Your answer: <input ref={el => questionRefs.current[index] = el!} />
                            </label>
                            <hr />
                        </div>
                    ))}
                    <div className="question-container">
                        <button style={{ marginTop: "30px", marginBottom: "30px" }} onClick={gradeQuiz}>
                            Grade your quiz.
                        </button>
                        {finalGrade.length > 1 &&
                            <h3 className="h3">
                                Your score: {percentage}
                            </h3>
                        }

                        {finalGrade.length > 1 && finalGrade.map((line, index) => (
                            <p className="answer-text" key={index}>{line}</p>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};

export default ShortAnswer;
