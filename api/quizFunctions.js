const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY']});  

async function gradeQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ 
      role: 'user', 
      content: 'The following text is a list of 5 questions followed by a list of 5 correct answers followed by a list of 5 user-provided answers to the same questions. Give the percentage of those answers that are correct and (for each incorrect user answer) explain why the user may have chosen each incorrect answer. Always refer to the user as "you."' + sampleText 
    }],
    model: 'claude-3-5-sonnet-20240620',
  });
  return message.content;
}

async function createMultipleChoiceQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ 
      role: 'user', 
      content: 'Create 5 multiple-choice joke questions followed by a set of 5 correct answers for a comedic quiz based on the following text. The list of correct answers should be preceded by "ANSWERS:". Always refer to the user as "you."' + sampleText 
    }],
    model: 'claude-3-5-sonnet-20240620',
  });
  return message.content;
}

async function createVocabularyQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ 
      role: 'user', 
      content: 'Create a 5-question multiple-choice vocabulary quiz based on the top 5 most difficult words from the following text. wers for a comedic quiz based on the following text. The list of correct answers should be preceded by "ANSWERS:". Always refer to the user as "you."' + sampleText 
    }],
    model: 'claude-3-5-sonnet-20240620',
  });
  return message.content;
}

async function createShortAnswerQuiz(sampleText) {
  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ 
      role: 'user', 
      content: 'Create a 5-question short-answer quiz with answers based on the following text. wers for a comedic quiz based on the following text. The list of correct answers should be preceded by "ANSWERS:". Always refer to the user as "you."' + sampleText 
    }],
    model: 'claude-3-5-sonnet-20240620',
  });
  return message.content;
}

module.exports = {
  gradeQuiz,
  createMultipleChoiceQuiz,
  createVocabularyQuiz,
  createShortAnswerQuiz
};
