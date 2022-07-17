// imports
import { Request, Response } from 'express';

export const limitHandler = (req: Request, res: Response) => {

    return res.status(400).json({
        message: 'TO_LARGE_FILE'
    });

}