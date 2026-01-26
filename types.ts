export interface Hymn {
  id: string;
  title: string;
  category?: string;
  lyrics: string[];
}

export interface AppState {
  view: 'list' | 'reader';
  activeHymnId: string | null;
}