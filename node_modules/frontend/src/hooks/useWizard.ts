"use client";

import type {
  OperationAnswers,
  PrimitiveAnswer,
  QuestionDefinition,
  VisibilityCondition,
} from "@autodosar/adi-core/operations";
import { useMemo, useState } from "react";

function conditionMatches(condition: VisibilityCondition, answers: OperationAnswers): boolean {
  const answer = answers[condition.questionId];
  if (condition.equals !== undefined) return answer === condition.equals;
  if (condition.notEquals !== undefined) return answer !== condition.notEquals;
  if (condition.oneOf) return condition.oneOf.includes(answer as PrimitiveAnswer);
  return false;
}

function isQuestionVisible(question: QuestionDefinition, answers: OperationAnswers): boolean {
  if (!question.visibleWhen) return true;
  const conditions = Array.isArray(question.visibleWhen)
    ? question.visibleWhen
    : [question.visibleWhen];
  return conditions.every((condition) => conditionMatches(condition, answers));
}

function hasAnswer(question: QuestionDefinition, answers: OperationAnswers): boolean {
  const value = answers[question.id];
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== "";
}

export function useWizard(questions: QuestionDefinition[]) {
  const [answers, setAnswers] = useState<OperationAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const visibleQuestions = useMemo(
    () => [...questions]
      .sort((a, b) => a.order - b.order)
      .filter((question) => isQuestionVisible(question, answers)),
    [questions, answers],
  );

  const safeIndex = Math.min(currentIndex, Math.max(visibleQuestions.length - 1, 0));
  const currentQuestion = visibleQuestions[safeIndex] ?? null;
  const canGoNext = currentQuestion ? !currentQuestion.required || hasAnswer(currentQuestion, answers) : false;
  const progress = visibleQuestions.length === 0
    ? 0
    : completed
      ? 100
      : Math.round(((safeIndex + 1) / visibleQuestions.length) * 100);

  function answer(questionId: string, value: PrimitiveAnswer | PrimitiveAnswer[]) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function next() {
    if (!canGoNext) return;
    if (safeIndex >= visibleQuestions.length - 1) {
      setCompleted(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
  }

  function previous() {
    if (completed) {
      setCompleted(false);
      return;
    }
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function edit(questionId: string) {
    const index = visibleQuestions.findIndex((question) => question.id === questionId);
    if (index < 0) return;
    setCompleted(false);
    setCurrentIndex(index);
  }

  function reset() {
    setAnswers({});
    setCurrentIndex(0);
    setCompleted(false);
  }

  return {
    answers,
    visibleQuestions,
    currentQuestion,
    currentIndex: safeIndex,
    completed,
    canGoNext,
    progress,
    answer,
    next,
    previous,
    edit,
    reset,
  };
}
