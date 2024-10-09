export interface Produit{
  id: number;
  image: string | null;
  nom_produit: string;
  description: string;
  prix: number;
  quantite: number;
  categorie_id: number;
}
