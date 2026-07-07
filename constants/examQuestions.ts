/**
 * Mock JavaScript exam used by the timed lesson exam dialog. In a real app this
 * would come from the service layer; keeping it here mirrors the other mock data.
 */

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answerIndex: number;
}

/** Exam length in seconds (10 minutes). */
export const EXAM_DURATION_SECONDS = 10 * 60;

export const JS_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: "q1",
    text: "Which keyword declares a block-scoped variable in JavaScript?",
    options: ["var", "let", "int", "define"],
    answerIndex: 1,
  },
  {
    id: "q2",
    text: "What does typeof null return?",
    options: ["\"null\"", "\"undefined\"", "\"object\"", "\"number\""],
    answerIndex: 2,
  },
  {
    id: "q3",
    text: "Which method adds one or more elements to the end of an array?",
    options: ["shift()", "unshift()", "pop()", "push()"],
    answerIndex: 3,
  },
  {
    id: "q4",
    text: "What does the === operator compare?",
    options: ["Value only", "Value and type", "Reference only", "Type only"],
    answerIndex: 1,
  },
  {
    id: "q5",
    text: "Which of the following is NOT a JavaScript primitive type?",
    options: ["String", "Boolean", "Object", "Number"],
    answerIndex: 2,
  },
  {
    id: "q6",
    text: "How do you write a single-line comment in JavaScript?",
    options: ["# comment", "// comment", "<!-- comment -->", "** comment"],
    answerIndex: 1,
  },
  {
    id: "q7",
    text: "What is the value of [1, 2, 3].length?",
    options: ["2", "3", "4", "undefined"],
    answerIndex: 1,
  },
  {
    id: "q8",
    text: "Which function converts a string to an integer?",
    options: ["parseFloat()", "toFixed()", "parseInt()", "Number.isInteger()"],
    answerIndex: 2,
  },
  {
    id: "q9",
    text: "What does Boolean(\"\") evaluate to?",
    options: ["true", "false", "undefined", "NaN"],
    answerIndex: 1,
  },
  {
    id: "q10",
    text: "Which keyword declares a value that cannot be reassigned?",
    options: ["let", "var", "const", "static"],
    answerIndex: 2,
  },
];
