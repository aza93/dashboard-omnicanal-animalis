export class User {
  /*
  id: number;
  firstName: string;
  lastName: string;
  token: string;
  store: string;
  */

  /*
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  birthday: Date;
  addressOne: string;
  addressTwo: string;
  zipCode: string;
  city: string;
  phoneOne: string;
  phoneTwo: string;
  profilType: string;
  profilPicture: string;
  admin: boolean;
  moderator: boolean;
  */

  token: string;
  store: string;
  admin: boolean;
  id: string;
  store_id: string;

  constructor(public email: string, public password: string) { };
}