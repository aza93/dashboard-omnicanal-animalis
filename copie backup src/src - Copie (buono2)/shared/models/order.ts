/*
export class Order {
    public magasin: string;
    public date_creation: string;
    public heure_creation: string;
    public type_commande: string;
    public numero_commande: string;
    public nom_client: string;
    public tel: string;
    public nb_produits: string;
}
*/


export class Order {
    constructor(
        public magasin: string = null,
        public date_creation: Date = null,
        public type_commande: string = null,
        public numero_commande: number = null,
        public nom_client: string = null,
        public tel: string = null,
        public nb_produits: number = null,
    ) {}

    public static fromJson(json: Object): Order {
        return new Order(
            json['magasin'],
            new Date(json['date_creation']),
            json['type_commande'],
            json['numero_commande'],
            json['nom_client'],
            json['tel'],
            json['nb_produits']
        )
      }
}