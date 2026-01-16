export type Question = {
    title: string,
    possible_answers: [Answer,Answer,Answer,Answer],
    openEnded?: boolean,
    imageUrl?: string,
    weight: number
}
export let newQuestion: Question = {
    title: "",
    possible_answers: [{id: 1, value: ""}, {id: 2, value: ""}, {id: 3, value: ""}, {id: 4, value: ""}],
    weight: 1
}
export type Answer = {
    id: number,
    value: string
}