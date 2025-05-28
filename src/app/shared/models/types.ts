export type TableData = {
    phone: string,
    name: string,
    score: number,
    userEntries: number[],
    date: string;
}
export type ScoreRecord = {
    name: string;
    phone?: string;
    grade?: string;
    quizId: number;
    school: string;
    score: number;
    date?: string;
    userEntries: number[];
}
export type ScoresData = {
    scoresBySchool: ScoreRecord[];
    quizDistinctDates: string[];
}
export type ScoresDataAdmin = {
    allScores: ScoreRecord[];
}
export type School = {
    _id?: string,
    id: string,
    name: string,
    supervisors: string[],
}
export type SchoolToAdd = {
    name: string,
    quizId: number,
    supervisor: {
        phone: string,
        name: string,
    }
}
export type UserDetails = {
    readonly name?: string;
    readonly phone?: string;
    readonly grade?: string;
    readonly role?: string;
    readonly schoolId?: string;
}

export type LogTypes = 'info' | 'error' | 'debug' | 'warning' | 'success';
export type Log = {
    _id?: string;
    timestamp: Date;
    message: string;
    context?: string;
    type: LogTypes;
}