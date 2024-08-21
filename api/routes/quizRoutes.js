const express = require('express');
const router = express.Router();
const { gradeQuiz, createMultipleChoiceQuiz, createVocabularyQuiz, createShortAnswerQuiz } = require('../quizFunctions');


router.get('/', (req, res) => {
    res.send('Quiz generator router');
  });

router.post('/', async (req, res) => {
  let output = "";
  switch (req.body.category) {
    case "joke":
      output = await createMultipleChoiceQuiz(req.body.pdfText);
      break;
    case "vocabulary":
      output = await createVocabularyQuiz(req.body.pdfText);
      break;
    case "grade-quiz":
      output = await gradeQuiz(req.body.pdfText);
      break;
    default:
      output = await createShortAnswerQuiz(req.body.pdfText);
  }
  res.send(output);
});

module.exports = router;
