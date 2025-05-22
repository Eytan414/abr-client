export type Question = {
    title: string,
    possible_answers: Answer[],
    openEnded?: boolean,
    imageUrl?: string,
    weight: number
}
export type Answer = {
    id: number,
    value: string
}