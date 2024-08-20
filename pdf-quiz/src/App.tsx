import './App.css';

import { useState } from 'react';
import * as React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfToText from 'react-pdftotext';

import MultipleChoice from "./components/MultipleChoice"
import ShortAnswer from "./components/ShortAnswer"
import Vocabulary from "./components/Vocabulary"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function App() {

  const [numPages, setNumPages] = useState<number>(0);
  const [pdfData, setPDFData] = useState<any>();
  const [pdfText, setPDFText] = useState<string>("sample text");
  const [quizType, setQuizType] = useState<string>("none");
  const quizComponent = document.getElementById("quiz-box");


  function onPDFLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function extractText() {
    const file = pdfData;
    pdfToText(file)
      .then(text => setPDFText(text))
      .catch(error => console.error("Failed to extract text from pdf"))
  }

  const onMultipleChoiceButtonClickHandler = () => {
    setQuizType("multiple-choice");
    extractText();
    setTimeout(async () => {
      if(quizComponent) quizComponent.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }, 300);
  };

  const onShortAnswerButtonClickHandler = () => {
    setQuizType("short-answer");
    extractText();
    setTimeout(async () => {
      if(quizComponent) quizComponent.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }, 300);
  };

  const onVocabularyButtonClickHandler = () => {
    setQuizType("vocabulary");
    extractText();
    setTimeout(async () => {
      if(quizComponent) quizComponent.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }, 300);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      setPDFData(files[0]);
    }
  };

  let styles = {
    root: {
      fontFamily: 'Roboto'
    }
    
  }

  return (

    <div className="App" style={styles.root}>
      <header style={{ backgroundImage: "linear-gradient(to right, #323232, #019CAD)" }} className="App-header">

        <h1>
          P D F Q u i z
        </h1>
        <p>
          Use <code>PDFQuiz</code> to create challenging AI-powered quizzes based on any text!
        </p>
        <p>
          Upload your PDF here (5-20 pages):
        </p>
        <input
          type="file"
          accept={"pdf"}
          onChange={onChange}
        />

        {pdfData && (
          <Document file={pdfData} onLoadSuccess={onPDFLoadSuccess}>
            <p>
              Your document contains {numPages} pages.
            </p>
            <div style={{ display: "flex" }}>
              <Page
                pageNumber={1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={0.3}
              />
              <Page
                pageNumber={2}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={0.3}
              />
              <Page
                pageNumber={3}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={0.3}
              />
            </div>
          </Document>
        )}

        {pdfData && <div style={{ width: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <button style={{ marginTop: "30px" }} onClick={() => onVocabularyButtonClickHandler()}> Create a vocabulary quiz.</button>
          <button style={{ marginTop: "30px" }} onClick={() => onShortAnswerButtonClickHandler()}> Create a short-answer quiz.</button>
          <button style={{ marginTop: "30px" }} onClick={() => onMultipleChoiceButtonClickHandler()}> Create a joke multiple-choice quiz.</button>
        </div>
        }

        <div id="quiz-box" >
          {quizType === "multiple-choice" && <MultipleChoice text={pdfText} title={pdfData.name}></MultipleChoice>}
          {quizType === "vocabulary" && <Vocabulary text={pdfText} title={pdfData.name}></Vocabulary>}
          {quizType === "short-answer" && <ShortAnswer text={pdfText} title={pdfData.name}></ShortAnswer>}
        </div>
      </header>

      <footer>
        <p>Created by: Katie Fo</p>
        <p><a href="mailto:kfodev@gmail.com">kfodev@gmail.com</a></p>
      </footer>

    </div>
  );
}

export default App;

