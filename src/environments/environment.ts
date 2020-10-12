// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  //apiUrlMagento: 'https://abdellah-n6foo5a-o4lvm5zl7t3ym.fr-1.platformsh.site',
  //apiUrlMagento: 'https://staging-m2.animalis.com',
  apiUrlMagento: 'https://www.animalis.com',

  //magentoUsername: "dashboard_omnicanal_envabde",
  //magentoPassword: "dashaza20envabde",
  magentoUsername: "dashboard_omnicanal",
  magentoPassword: "dashaza20*animalis",

  /*
  firebaseConfig: {
    apiKey: "AIzaSyCDjCDSjj7I79qSS0-vIIV0dPJhIF7ZYNI",
    authDomain: "dashboard-omnicanal-animalis.firebaseapp.com",
    databaseURL: "https://dashboard-omnicanal-animalis.firebaseio.com",
    projectId: "dashboard-omnicanal-animalis",
    storageBucket: "dashboard-omnicanal-animalis.appspot.com",
    messagingSenderId: "400146142829",
    appId: "1:400146142829:web:cd56ee0e60d3d735cb5164",
    measurementId: "G-8J1P28KF93"
  },
  */
  
  firebaseConfig: {
    apiKey: "AIzaSyCI-myHa-zE64y9QBk3nqeW8YqDih2Z834",
    authDomain: "dashboard-omnicanal-anim-3d764.firebaseapp.com",
    databaseURL: "https://dashboard-omnicanal-anim-3d764.firebaseio.com",
    projectId: "dashboard-omnicanal-anim-3d764",
    storageBucket: "dashboard-omnicanal-anim-3d764.appspot.com",
    messagingSenderId: "299240012242",
    appId: "1:299240012242:web:47ebde380d5f928161700b",
    measurementId: "G-LFMFNCQN28"
  },

  pageSize: 100,
  pageSizeAdmin: 500,

  columnDefsAllOrders: [
    { headerName: 'ID', field: "id", width: 150, resizable: true },
    { headerName: 'Magasin', field: "magasin", width: 300, resizable: true },
    { headerName: 'Date de la commande', field: "date_creation", width: 250, resizable: true, sortable: false },
    { headerName: 'Date mise de coté', field: "date_mise_de_cote", resizable: true, sortable: false },
    { headerName: "Date d'expédition", field: "date_exp", resizable: true, sortable: false },
    { headerName: 'Type de commande', field: "type_commande", width: 450, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", width: 200, resizable: true },
    { headerName: 'Nom client', field: "nom_client", width: 200, resizable: true },
    { headerName: 'Téléphone', field: "tel", width: 200, resizable: true },
    { headerName: 'Nb produits', field: "nb_produits", width: 150, resizable: true },
    { headerName: 'Commande dispo depuis (jours)', field: "dispo_depuis" },
    { headerName: 'Retard (en heures)', field: "retardHeures", resizable: true },
  ],
  columnDefsOrdersToPrepare: [
    { headerName: 'ID', field: "id", width: 150, resizable: true },
    { headerName: 'Magasin', field: "magasin", width: 300, resizable: true },
    { headerName: 'Date de la commande', field: "date_creation", width: 250, resizable: true, sortable: false },
    { headerName: 'Type de commande', field: "type_commande", width: 450, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", width: 200, resizable: true },
    { headerName: 'Nom client', field: "nom_client", width: 200, resizable: true },
    { headerName: 'Téléphone', field: "tel", width: 200, resizable: true },
    { headerName: 'Nb produits', field: "nb_produits", width: 150, resizable: true },
    { headerName: 'Retard (en jours)', field: "retard", width: 150, resizable: true },
  ],
  columnDefsOrdersDelayed: [      
    { headerName: 'ID', field: "id", resizable: true },
    { headerName: 'Magasin', field: "magasin", resizable: true },
    { headerName: 'Date de la commande', field: "date_creation", resizable: true, sortable: false },
    { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
    { headerName: 'Nom client', field: "nom_client", resizable: true },
    { headerName: 'Téléphone', field: "tel", resizable: true },
    { headerName: 'Nb produits', field: "nb_produits", resizable: true },
    { headerName: 'Retard (en heures)', field: "retard", resizable: true },
  ],
  columnDefsOrderAvMoreFourteenDd: [      
    { headerName: 'ID', field: "id", resizable: true },
    { headerName: 'Magasin', field: "magasin" },
    { headerName: 'Date de la commande', field: "date_creation", resizable: true, sortable: false },
    { headerName: 'Date mise de coté', field: "date_mise_de_cote", resizable: true, sortable: false },
    { headerName: 'Commande dispo depuis (jours)', field: "dispo_depuis", resizable: true },
    { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
    { headerName: 'Nom client', field: "nom_client", resizable: true },
    { headerName: 'Téléphone', field: "tel", resizable: true },
    { headerName: 'Nb produits', field: "nb_produits", resizable: true },
  ],
  columnDefsOrdersAvLessFourteenDd: [    
    { headerName: 'ID', field: "id", resizable: true },  
    { headerName: 'Magasin', field: "magasin" },
    { headerName: 'Date de la commande', field: "date_creation", resizable: true, sortable: false },
    { headerName: 'Date mise de coté', field: "date_mise_de_cote", resizable: true, sortable: false },
    { headerName: 'Commande dispo depuis (jours)', field: "dispo_depuis" },
    { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
    { headerName: 'Nom client', field: "nom_client", resizable: true },
    { headerName: 'Téléphone', field: "tel", resizable: true },
    { headerName: 'Nb produits', field: "nb_produits", resizable: true },
  ],
  columnDefsOrdersInProgress: [ 
    { headerName: 'ID', field: "id", resizable: true },     
    { headerName: 'Magasin', field: "magasin", resizable: true },
    { headerName: 'Date de la commande', field: "date_commande", resizable: true, sortable: false },
    { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
    { headerName: 'Nom client', field: "nom_client", resizable: true },
    { headerName: 'Téléphone', field: "tel", resizable: true },
    { headerName: 'Nb produits', field: "nb_produits", resizable: true },
  ],
  columnDefsOrdersShipping: [      
    { headerName: 'ID', field: "id", resizable: true },
    { headerName: 'Magasin', field: "magasin", resizable: true },
    { headerName: 'Date de la commande', field: "date_commande", resizable: true, sortable: false },
    { headerName: "Date d'expédition", field: "date_expedition", resizable: true, sortable: false },
    { headerName: 'Type de commande', field: "type_commande", width: 300, resizable: true },
    { headerName: 'Numéro de commande', field: "numero_commande", resizable: true },
    { headerName: 'Nom client', field: "nom_client", resizable: true },
    { headerName: 'Téléphone', field: "tel", resizable: true },
    { headerName: 'Nbs de produits', field: "nb_produits", resizable: true },
  ],

  amstyStoreLocator: [
    {
      name: 'Animalis Reims St Brice Courcelles'
    },
    {
      name: 'TEST'
    },
    {
      name: 'Animalis Antibes'
    },
    {
      name: 'Animalis Aubagne'
    },
    {
      name: 'Animalis Avignon'
    },
    {
      name: "Animalis Bois d'Arcy"
    },
    {
      name: 'Animalis Bondy'
    },
    {
      name: 'Animalis Beynost'
    },
    {
      name: 'Animalis Bordeaux Lac'
    },
    {
      name: 'Animalis Bourges'
    },
    {
      name: 'Animalis Brive'
    },
    {
      name: 'Animalis Brest'
    },
    {
      name: 'Animalis Chennevieres'
    },
    {
      name: 'Animalis Chalon S/Saone'
    },
    {
      name: 'Animalis Chaville'
    },
    {
      name: 'Animalis Clermont-Ferrand'
    },
    {
      name: 'Animalis Compiègne'
    },
    {
      name: 'Animalis Eragny'
    },
    {
      name: 'Animalis Fresnes'
    },
    {
      name: 'Animalis Groslay'
    },
    {
      name: 'Animalis Herblay'
    },
    {
      name: 'Animalis Lognes'
    },
    {
      name: 'Animalis Le Mans'
    },
    {
      name: 'Animalis Maurepas/Coignieres'
    },
    {
      name: 'Animalis Orgeval'
    },
    {
      name: 'Animalis Paris Bercy'
    },
    {
      name: 'Animalis Plaisir'
    },
    {
      name: 'Animalis Poitiers'
    },
    {
      name: 'Animalis Quimper'
    },
    {
      name: 'Animalis Aubenas'
    },
    {
      name: 'Animalis La Seyne/Mer'
    },
    {
      name: 'Animalis Sainte Genevieve des Bois'
    },
    {
      name: 'Animalis St Brieuc'
    },
    {
      name: 'Animalis Saint Priest'
    },
    {
      name: 'Animalis Toulon/La Garde'
    },
    {
      name: 'Animalis Tourville'
    },
    {
      name: 'Animalis Vannes'
    },
    {
      name: 'Animalis Villebon'
    },
    {
      name: 'Animalis Vert Saint Denis'
    },
    {
      name: 'Animalis- Perigueux'
    },
    {
      name: 'Animalis- Reims Cormontreuil'
    },
    {
      name: 'Animalis Bergerac'
    },
    {
      name: 'Animalis Nice'
    },
    {
      name: 'Animalis Thonon les Bains'
    },
    {
      name: 'Point retrait Animalis.com'
    },
  ]
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
