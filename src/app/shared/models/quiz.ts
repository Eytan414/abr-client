import { Question } from "./question"

export type Quiz = {
    _id?: number,
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
