export interface Ressource {
  id: number;
  titre: string;
  documents: string;
  video_id: number;
  video?: {
    id: number;
    titre: string;
  };
}
