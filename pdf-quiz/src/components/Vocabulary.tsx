import React from "react";
import { text } from "stream/consumers";

export interface Props {
    text: string;
    title: string;
};

export interface State {
    quiz: string;
    questions: string[];
    answers: string[];
    correctAnswers: string;
    finalGrade: string;

};

class Vocabulary extends React.Component<Props, State> {
    state: State = {
        quiz: "Loading, please wait...",
        questions: [],
        answers: [],
        correctAnswers: "",
        finalGrade: "Loading"

    };


    convertQuizToLinks = async (rawText: string) => {
        let removeIntro = rawText.substring(rawText.indexOf("1."));
        await this.setState({ quiz: removeIntro });
        let cleanQuestions = await removeIntro.replaceAll("\\n", "");
        let noSlash = await cleanQuestions.replaceAll("\\", "");
        await this.setState({ quiz: noSlash });
        let regex = /(\d+\.\d*)\s?(.*?)(?=\d+\.|$)/gs;

        let questionsAndAnswers = noSlash.match(regex);
        console.log(questionsAndAnswers);

        let separateQuestions = [];
        let separateAnswers = [];
        let separateResponses = "";


        if (questionsAndAnswers) {
            for (let i = 0; i < questionsAndAnswers.length; i++) {
                let splitPair = questionsAndAnswers[i].split("a)");
                separateQuestions[i] = splitPair[0].split('?')[0] + "?";
                separateAnswers[i] = "a)" + splitPair[1];
            }
            let splitResponse;
            console.log(separateQuestions);
            splitResponse = separateAnswers[4].split("Answers:");
            separateResponses = separateQuestions[5] + ","
                + separateQuestions[6] + ","
                + separateQuestions[7] + ","
                + separateQuestions[8] + ","
                + separateQuestions[9] + ",";
        }

        await this.setState({ questions: separateQuestions, answers: separateAnswers, correctAnswers: separateResponses })
    }

    getQuiz = async () => {
        console.log("getQuiz");


        const fetchData = await fetch('http://localhost:3001/processQuiz',
            {
                method: "POST",
                body: JSON.stringify({
                    category: "vocabulary",
                    pdfText: this.props.text
                }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                })
            }
        );
        const textData = await fetchData.text();
        await console.log(textData);
        const quizText = await JSON.stringify(textData);
        await this.convertQuizToLinks(quizText);

    };


    gradeQuiz = async () => {
        let correctAnswers = "CORRECT ANSWERS: " + this.state.correctAnswers.toString();
        let output = "USER ANSWERS: " + (document.getElementById("question1") as HTMLInputElement).value
            + ", " + (document.getElementById("question2") as HTMLInputElement).value
            + ", " + (document.getElementById("question3") as HTMLInputElement).value
            + ", " + (document.getElementById("question4") as HTMLInputElement).value
            + ", " + (document.getElementById("question5") as HTMLInputElement).value;

        const fetchData = await fetch('http://localhost:3001/processQuiz',
            {
                method: "POST",
                body: JSON.stringify({
                    category: "grade-quiz",
                    pdfText: this.state.questions.toString() + correctAnswers + output
                }),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                })
            }
        );
        const textData = await fetchData.text();
        await console.log(textData);
        const quizText = await JSON.stringify(textData);
        let cleanQuestions = await quizText.replaceAll("\\n", "");
        let noSlash = await cleanQuestions.replaceAll("\\", "");

        await this.setState({ finalGrade: noSlash });

    };


    async componentDidMount() {
        console.log("Vocabulary Quiz");
        setTimeout(async () => {
            await this.getQuiz();
        }, 1000);
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <nav>
                <h1 className="h1">Vocabulary Quiz on <b>{this.props.title.substring(0, this.props.title.length - 4)}</b></h1>
                {(this.state.quiz == "Loading, please wait...") &&
                    <p className="h1">{this.state.quiz}</p>
                }
                {(this.state.quiz != "Loading, please wait...") &&
                    <div>
                        <form action="">
                            <p>{this.state.questions[0]}</p>
                            <p>{this.state.answers[0]}</p>
                            <label>
                                Your answer: <input id="question1" />
                            </label>
                            <hr />
                            <p>{this.state.questions[1]}</p>
                            <p>{this.state.answers[1]}</p>
                            <label>
                                Your answer: <input id="question2" />
                            </label>
                            <hr />
                            <p>{this.state.questions[2]}</p>
                            <p>{this.state.answers[2]}</p>
                            <label>
                                Your answer: <input id="question3" />
                            </label>
                            <hr />
                            <p>{this.state.questions[3]}</p>
                            <p>{this.state.answers[3]}</p>
                            <label>
                                Your answer: <input id="question4" />
                            </label>
                            <hr />
                            <p>{this.state.questions[4]}</p>
                            <p>{this.state.answers[4]}</p>
                            <label>
                                Your answer: <input id="question5" />
                            </label>
                            <hr />
                        </form>
                        <button style={{ marginTop: "30px" }} onClick={() => this.gradeQuiz()}> Grade your quiz.</button>
                        {(this.state.finalGrade !== "Loading grade") &&
                            <p className="h1">{this.state.finalGrade}</p>
                        }
                    </div>

                }
            </nav>
        )
    }
}

export default Vocabulary