export type Question = {
    title: string,
    possible_answers: Answer[],
    imageUrl?: string,
    weight: number
}
export type Answer = {
    id: number,
    value: string
}