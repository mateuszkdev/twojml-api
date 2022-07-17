import { Request, Response } from 'express';
import Application from '../Structures/Application/App';

export interface RouteArgs {
    req: Request;
    res: Response;
    app: Application;
}

export interface Route {
    endpoint: string;
    method: 'POST' | 'PUT' | 'DELETE' | 'GET';
    disabled?: boolean;
    run: (data: RouteArgs) => Promise<unknown>;
}