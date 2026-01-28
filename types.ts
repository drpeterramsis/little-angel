export interface Hymn {
  id: number;
  title: string;
  lyrics: string;
}

export interface ChoirMember {
  id: number;
  name: string;
  role: string;
}

export interface SearchState {
  term: string;
  triggerHighlight: boolean;
}