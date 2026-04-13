export interface IGame {
    id: number;
    date: string;
    status: string;
    team: number;
    opponent: number;
    is_home_game: boolean;
}