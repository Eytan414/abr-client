export type TableData = {
    phone: string,
    name: string,
    score: number,
    userEntries: number[],
    date: string;
    // timestamp: Date,
}
export type ScoreRecord = {
    name: string;
    phone?: string;
    quizId: number;
    school: string;
    score: number;
    // timestamp: string;
    date?: string;
    userEntries: number[];
}
export type ScoresData = {
    scoresBySchool: ScoreRecord[];
    // allScores?: ScoreRecord[];
    quizDistinctDates: string[];
}
export type ScoresDataAdmin = {
    allScores: ScoreRecord[];
}
export type School = {
    id: string,
    name: string,
}
export type SchoolToAdd = {
    name: string,
    quizId: number,
    supervisor: {
        phone: string,
        name: string,
    }
}