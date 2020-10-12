
export class OrderAllFields {
    constructor(
        public id: number = null,
        public magasin: string = null,
        public date_creation: string = null,
        public date_mise_de_cote: string = null,
        public date_exp: string = null,
        public type_commande: string = null,
        public numero_commande: number = null,
        public nom_client: string = null,
        public tel: string = null,
        public nb_produits: number = null,
        public dispo_depuis: number = null,
        public retardHeures: number = null,
    ) {}
}