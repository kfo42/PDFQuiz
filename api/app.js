const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY']});

async function gradeQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'The following text is a list of 5 questions followed by a list of 5 correct answers followed by a list of 5 user-provided answers to the same. Give the percentage of those answers that are correct and (for each incorrect user answer) explain why the user may have chosen each incorrect answer:' + sampleText }],
    model: 'claude-3-opus-20240229',
  });
  return message.content;
}

async function createMultipleChoiceQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Create 5 multiple-choice joke questions followed by a set of 5 correct answers for a comedic quiz based on the following text: ' + sampleText }],
    model: 'claude-3-opus-20240229',
  });
  return message.content;
}

async function createVocabularyQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Create a 5-question multiple-choice vocabulary quiz based on the top 5 most difficult words from the following text: ' + sampleText }],
    model: 'claude-3-opus-20240229',
  });
  return message.content;
}

async function createShortAnswerQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Create a 5-question short-answer quiz with answers based on the following text: ' + sampleText }],
    model: 'claude-3-opus-20240229',
  });
  return message.content;
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//
app.post('/processQuiz', async function (req, res) {
  let output = "";
  if (req.body.category == "joke") {
    output = await createMultipleChoiceQuiz(req.body.pdfText);
    -    res.send(output);
  } else if (req.body.category == "vocabulary") {
    output = await createVocabularyQuiz(req.body.pdfText);
    -    res.send(output);
  } else if (req.body.category == "grade-quiz") {
    output = await gradeQuiz(req.body.pdfText);
    -    res.send(output);
  } else {
    output = await createShortAnswerQuiz(req.body.pdfText);
    -    res.send(output);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
