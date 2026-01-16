import { Question } from "./question"

export type Quiz = {
    id?: number,
    title: string,
    questions: Question[],
    answers: number[],
    score?: number
}
export let newQuiz: Quiz = {
    title: "",
    questions: [],
    answers: []
}
