import React, { useState, useEffect, useRef, useCallback } from "react";
import { postRequest } from '../utils/apiUtils';
import { parseQuestionsAndAnswers, splitQuestionAndAnswers, parseAnswerChoices } from '../utils/stringUtils';
import '../styles/Quiz.css';

export interface Props {
    text: string;
    title: string;
    quizType: string;
}

const MultipleChoice: React.FC<Props> = ({ text, title, quizType }) => {
    const [quiz, setQuiz] = useState("Loading, please wait...");
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[][]>([]);
    const [correctAnswers, setCorrectAnswers] = useState("");
    const [finalGrade, setFinalGrade] = useState(["Loading"]);
    const [percentage, setPercentage] = useState();

    const questionRefs = useRef<(HTMLInputElement | null)[][]>([]);

    const capitalizedCategory = quizType.charAt(0).toUpperCase() + quizType.slice(1);
    const formattedTitle = title.substring(0, title.length - 4);


    const convertQuizToLinks = async (rawText: string) => {
        const questionsAndAnswers = parseQuestionsAndAnswers(rawText);
        const separateQuestions: string[] = [];
        const separateAnswers: string[][] = [];

        for (let i = 0; i < questionsAndAnswers.length; i++) {
            if (i < 5) {
                const [question, answerString] = splitQuestionAndAnswers(questionsAndAnswers[i]);
                separateQuestions[i] = question;
                separateAnswers[i] = parseAnswerChoices(answerString);
            } else {
                separateQuestions[i] = questionsAndAnswers[i];
            }
        }
        const separateResponses = separateQuestions.slice(5).join(",");

        setQuestions(separateQuestions.slice(0, 5));
        setAnswers(separateAnswers);
        setCorrectAnswers(separateResponses);
    };

    const getQuiz = async () => {
        const rawQuizText = await postRequest(quizType, text)
        const textData = await rawQuizText.text();
        await convertQuizToLinks(textData);
        setQuiz("quiz ready");
    };


    const gradeQuiz = async () => {
        const userAnswers = getUserAnswers();
        const correctAnswersString = `CORRECT ANSWERS: ${correctAnswers}`;
        const userAnswersString = `USER ANSWERS: ${userAnswers.join(', ')}`;

        const rawQuizText = await postRequest('grade-quiz', `${questions.toString()} ${answers.toString()} ${correctAnswersString} ${userAnswersString}`)
        const textData = await rawQuizText.json();
        const formattedResponse = textData[0].text.split('\n').filter((line: string) => line.trim() !== '');

        setFinalGrade(formattedResponse);
        const extractedPercentage = textData[0].text.match(/(\d{1,3}(\.\d+)?)%/);
        setPercentage(extractedPercentage[0]);
    };

    const getUserAnswers = () => {
        const selectedAnswers = questionRefs.current.map((questionRef) => {
            const selectedOption = questionRef.find((ref) => ref?.checked);
            return selectedOption ? selectedOption.value : null;
        });
        return selectedAnswers;
    };

    const setQuestionRef = (index: number, answerIndex: number) => (el: any) => {
        if (!questionRefs.current[index]) {
            questionRefs.current[index] = [];
        }
        questionRefs.current[index][answerIndex] = el;
    };

    useEffect(() => {
        console.log("Multiple-Choice Quiz");
        getQuiz();
    }, []);

    return (
        <div>
            <h3>
                Multiple-Choice {capitalizedCategory} Quiz on <b>{formattedTitle}</b>
            </h3>
            {quiz === "Loading, please wait..." ? (
                <p className="h1">{quiz}</p>
            ) : (
                <div className="question-container">
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p className="question-text">{question}</p>
                            {answers[index].map((answer, answerIndex) => (
                                <div key={answerIndex} className="answer-container">
                                    <input
                                        type="radio"
                                        value={String.fromCharCode(97 + answerIndex)}
                                        ref={setQuestionRef(index, answerIndex)}
                                    />
                                    <label
                                        htmlFor={`question${index + 1}_answer${answerIndex + 1}`}
                                        className="answer-text"
                                    >
                                        {answer}
                                    </label>
                                </div>
                            ))}
                            <hr />
                        </div>
                    ))}
                    <button className="question-container" onClick={gradeQuiz}>
                        Grade your quiz.
                    </button>
                </div>
            )}
            {finalGrade.length > 1 &&
                <h3>
                    Your score: {percentage}
                </h3>
            }
            <div className="question-container">
                {finalGrade.length > 1 && finalGrade.map((line, index) => (
                    <p className="question-text" key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}

export default MultipleChoice;
