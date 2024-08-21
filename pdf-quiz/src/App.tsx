import './App.css';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfToText from 'react-pdftotext';
import MultipleChoice from "./components/MultipleChoice";
import ShortAnswer from "./components/ShortAnswer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const App: React.FC = () => {
  const [pdfData, setPDFData] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfText, setPDFText] = useState<string>("sample text");
  const [textExtracted, setTextExtracted] = useState<boolean>(false);
  const [quizType, setQuizType] = useState<string>("none");

  const onPDFLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const extractText = async () => {
    if (pdfData) {
      try {
        setTextExtracted(false);
        const text = await pdfToText(pdfData);
        setPDFText(text);
        setTextExtracted(true);
      } catch (error) {
        console.error("Failed to extract text from pdf", error);
      }
    }
  };

  const onMultipleChoiceButtonClickHandler = () => {
    setQuizType("multiple-choice");
    extractText();
  };

  const onShortAnswerButtonClickHandler = () => {
    setQuizType("short-answer");
    extractText();
  };

  const onVocabularyButtonClickHandler = () => {
    setQuizType("vocabulary");
    extractText();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setTextExtracted(false);
      setPDFData(files[0]);
    }
  };

  const styles = {
    root: {
      fontFamily: 'Roboto'
    }
  };
  
  return (
    <div className="App" style={styles.root}>
      <header style={{ backgroundImage: "linear-gradient(to right, #2c3e50, #4b0082)" }} className="App-header">
        <h1>P D F Q u i z</h1>
        <p>Use <code>PDFQuiz</code> to create challenging AI-powered quizzes based on any text!</p>
        <p>Upload your PDF here (5-20 pages):</p>
        <input type="file" accept="application/pdf" onChange={onChange} />

        {pdfData && (
          <Document file={pdfData} onLoadSuccess={onPDFLoadSuccess}>
            <p>Your document contains {numPages} pages.</p>
            {(numPages < 4 || numPages > 20) && <p>Please upload a PDF that is between 5 and 20 pages.</p>}

            <div style={{ display: "flex" }}>
              {[1, 2, 3].map(pageNumber => (
                <Page
                  key={pageNumber}
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={0.3}
                />
              ))}
            </div>
          </Document>
        )}

        {pdfData && !(numPages < 4 || numPages > 20) && (
          <div style={{ width: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <button style={{ marginTop: "30px" }} onClick={onShortAnswerButtonClickHandler}>Create a short-answer quiz.</button>
            <button style={{ marginTop: "30px" }} onClick={onVocabularyButtonClickHandler}>Create a vocabulary quiz.</button>
            <button style={{ marginTop: "30px" }} onClick={onMultipleChoiceButtonClickHandler}>Create a joke multiple-choice quiz.</button>
          </div>
        )}

        {textExtracted && (
          <div>
            {quizType === "multiple-choice" && <MultipleChoice text={pdfText} title={pdfData?.name || ''} quizType={"joke"} />}
            {quizType === "vocabulary" && <MultipleChoice text={pdfText} title={pdfData?.name || ''} quizType={"vocabulary"} />}
            {quizType === "short-answer" && <ShortAnswer text={pdfText} title={pdfData?.name || ''} />}
          </div>
        )}
      </header>

      <footer>
        <p>Created by: Katie Fo</p>
        <p><a href="mailto:kfodev@gmail.com">kfodev@gmail.com</a></p>
      </footer>
    </div>
  );
};

export default App;
