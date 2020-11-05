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
        public id: number = null,
        public magasin: string = null,
        public date_creation: string = null,
        public type_commande: string = null,
        public numero_commande: number = null,
        public nom_client: string = null,
        public tel: string = null,
        public nb_produits: number = null,
        public dispo_depuis: string = null,
    ) {}
}