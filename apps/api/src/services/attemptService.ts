import Quiz from '../database/models/Quiz';
import Attempt from '../database/models/Attempt';
import mongoose from 'mongoose';

type UserAnswer = {
  qid: string;
  answerIndex: number;
};

export const processAndSaveAttempt = async (userId: string, quizId: string, userAnswers: UserAnswer[]) => {
  // 1. Fetch the quiz with the correct answers
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  // 2. Grade the attempt
  const topicScores: Record<string, { correct: number; total: number }> = {};
  let correctAnswersCount = 0;

  for (const question of quiz.questions) {
    const userAnswer = userAnswers.find(ua => ua.qid === question.qid);
    
    // Initialize topic if not present
    if (!topicScores[question.topicKey]) {
      topicScores[question.topicKey] = { correct: 0, total: 0 };
    }
    topicScores[question.topicKey].total += 1;

    if (userAnswer && userAnswer.answerIndex === question.answerIndex) {
      correctAnswersCount++;
      topicScores[question.topicKey].correct += 1;
    }
  }

  // 3. Calculate final scores
  const overallScore = (correctAnswersCount / quiz.questions.length) * 100;
  const perTopicScore: Record<string, number> = {};
  for (const topic in topicScores) {
    const { correct, total } = topicScores[topic];
    perTopicScore[topic] = (correct / total) * 100;
  }
  
  // 4. Save the attempt to the database
  const newAttempt = new Attempt({
    userId: new mongoose.Types.ObjectId(userId),
    quizId: new mongoose.Types.ObjectId(quizId),
    score: overallScore,
    perTopic: perTopicScore,
  });

  await newAttempt.save();

  // 5. Return the results
  return {
    attemptId: newAttempt._id,
    score: newAttempt.score,
    perTopic: newAttempt.perTopic,
  };
};