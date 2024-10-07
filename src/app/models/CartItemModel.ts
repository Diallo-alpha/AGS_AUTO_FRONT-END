export interface CartItem {
  id: number;
  type: 'produit' | 'formation';
  nom: string;
  prix: number;
  quantite: number;
}
