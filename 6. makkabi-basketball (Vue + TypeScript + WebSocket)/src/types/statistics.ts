export interface Statistics {
    game_id: number;
    opponent_score: number;
    team_score: number;
    substitutions: number[];
    player_stats: IPlayerStats[]
}

interface IPlayerStats {
    assists: number;
    blocks: number;
    fouls: number;
    player: string;
    points: number;
    rebounds: number;
    steals: number;
}