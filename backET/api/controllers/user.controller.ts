/*import type { Request, Response } from "express";


const register = (req: Request, res: Response) => {
    return res.send('registered');
}
const login = (req: Request, res: Response) => {
    return res.send('login');
}
const account = (req: Request, res: Response) => {
    return res.send('account');
}

export {register,login,account};
*/

import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
    return res.send('registered');
};

export const login = async (req: Request, res: Response) => {
    return res.send('login');
};

export const account = async (req: Request, res: Response) => {
    return res.send('account');
};

