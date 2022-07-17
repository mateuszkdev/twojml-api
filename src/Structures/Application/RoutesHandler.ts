// imports
import express from 'express';
import Application from './App';
import fs from 'fs';
import { Route } from 'Types/Route';

/**
 * @name RoutesHandler
 * @description Class representing RotuesHandler
 */
export default class RoutesHandler {

    private app: Application;

    /**
     * @description Create RoutesHandler
     * @param {Application} app
     */
    constructor(app: Application) {

        this.app = app;
        this.loadRoutes();

    }

    /**
     * @name loadRoutes
     * @description Load api routes
     * @returns {*}
     * @private
     */
    private loadRoutes(): void {

        fs.readdirSync(this.app.baseDir + '/Routes/').forEach(async dir => {

            const router = express.Router();

            await new Promise(resolve => {

                const files = fs.readdirSync(`${this.app.baseDir}/Routes/${dir}`).filter(file => file.endsWith('.route.ts') || file.endsWith('.route.js') && !file.startsWith('--'));

                files.forEach((file, i) => {

                    try {

                        const routeData: Route = require(`../../Routes/${dir}/${file}`).default;

                        if (!routeData.endpoint || !routeData.run || !routeData.method) throw new Error('Endpoint, run or method is missing');

                        router[<'get' | 'post' | 'put' | 'delete'>routeData.method.toLocaleLowerCase()](routeData.endpoint, async (req, res) => {

                            if (routeData.disabled) return res.status(200).json({ message: 'ENDPOINT_DISABLED' });

                            const response = await routeData.run({ req, res, app: this.app }).catch(e => e);

                            if (response instanceof Error) {

                                this.app.log.error(`Error while executing ${file}`);
                                console.log(response);

                            }

                        });

                        this.app.log.info(`Successfully loaded ${file} on ${dir}${routeData.endpoint} [${routeData.method}]`);

                    } catch (e) {

                        this.app.log.error(`Error while loading ${file}`);
                        console.log(e);

                    }

                    if (!files[i + 1]) resolve(true);

                });

            });

            this.app.server.use(`/${dir}`, router);

        });

    }

}