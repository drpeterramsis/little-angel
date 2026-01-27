export interface Hymn {
  id: number;
  title: string;
  lyrics: string;
}

export interface SearchState {
  term: string;
  triggerHighlight: boolean;
}