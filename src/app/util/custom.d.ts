declare namespace Express {
  export interface Request {
    dbUser: {
      username: string;
      id: number | string;
      token: string;
    };
  }
}
