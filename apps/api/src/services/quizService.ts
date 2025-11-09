import Quiz from '../database/models/Quiz';

export const findQuizzesByDomain = async (domainSlug: string) => {
  const quizzes = await Quiz.find({ domainSlug }).select('-__v -questions.answerIndex');
  if (!quizzes) {
    return [];
  }
  return quizzes;
};