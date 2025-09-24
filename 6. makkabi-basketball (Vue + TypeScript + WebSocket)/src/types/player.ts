export interface IPlayer {
    id: number;
    name: string;
    is_active: boolean;
    team: number;
    number: number;
    position: string;
}

export interface Player {
    id?: number;
    name?: string;
    is_active?: boolean;
    team?: number;
    number?: number;
    position?: string;
}