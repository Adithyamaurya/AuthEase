
export type MediaType = 'text' | 'image' | 'audio' | 'video' | 'url';
export type DifficultyMode = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface AnalysisResult {
  sourceCredibility: number;
  manipulationRisk: number;
  aiSyntheticProb: number;
  trustIndex: number;
  findings: string[];
  explanation: string;
  metadata: Record<string, any>;
}

export interface GameChallenge {
  id: string;
  type: MediaType;
  difficulty: DifficultyMode;
  optionA: {
    content: string;
    isAi: boolean;
    explanation: string;
  };
  optionB: {
    content: string;
    isAi: boolean;
    explanation: string;
  };
  narrative: string;
}

export enum GameState {
  START = 'START',
  DIFFICULTY_SELECT = 'DIFFICULTY_SELECT',
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK',
  SUMMARY = 'SUMMARY'
}

export interface GameStats {
  accuracy: number;
  streak: number;
  totalRounds: number;
  correctRounds: number;
  xp: number;
  level: number;
}
