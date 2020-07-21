export class User {
  id: number;
  firstName: string;
  lastName: string;
  token: string;

  constructor(public email: string, public password: string){};

}