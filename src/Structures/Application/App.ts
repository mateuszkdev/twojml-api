// imports
import express from 'express';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import Logger from '../../Utilities/Logger';
import RoutesHandler from './RoutesHandler';
import { dbConnect } from '../Database/index';
import { limitHandler } from '../../Utilities/LimitHandler';

/**
 * @name Application
 * @description Main Express app class
 */
export default class Application {

    public baseDir: string;
    public port: any;
    public server: express.Application;
    public log: Logger;
    // public hook = WebhookSender.prototype;
    // public tokens: Tokens;

    /**
     * @description Create Application
     * @param {string} dirname
     * @param {number | undefined} port
     */
    constructor({ dirname, port }: { dirname: string, port: any }) {

        // Check constructor options
        if (!dirname) throw new Error('You must provide basic dir to class constructor');
        if (!port) throw new Error('You must provide Application port to class constructor');

        // Set values to this
        this.log = new Logger();
        this.log.info('Loading values to this..');
        this.baseDir = dirname;
        this.port = port;
        this.server = express();
        // this.server.use(this.sessionConstruct); @todo Repair to many redirects
        this.log.ready('Success!');

        // Start Application Routes Handler
        this.log.info('Loading RoutesHandler..');
        new RoutesHandler(this);
        this.log.ready('RoutesHandler loaded successfully!');

        // Set up Sets and Uses
        this.log.info('Prepare to setup Application Sets and Uses');
        this.setUpSets;
        this.setUpUses;
        this.log.ready('Success!');

        // Start Database
        this.log.info('Starting Database..');
        this.startDatabase();
        this.log.ready('Database connected successfully!');

        // Prepare for http 404
        this.server.get('*', (req, res) => res.redirect('/'));
        this.log.info('Loaded http 404 getter.');
        this.log.ready('Application ready to start.');

    }

    private async startDatabase(): Promise<void> {

        // Connect
        const dbConnection = dbConnect(this);

        // Check connection
        if (!dbConnection) throw new Error('Database connection failed...');
        this.log.info('MongoDB connected successfully!');

    }

    /**
     * @name sessionConstruct
     * @description Getter for Application session
     * @returns {express.RequestHandler} session
     * @private
     */
    private get sessionConstruct(): express.RequestHandler {

        return session({
            secret: process.env.SECRET as string,
            cookie: {
                httpOnly: false,
                secure: false,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            },
            saveUninitialized: false,
            resave: true
        });

    }

    /**
     * @name fileUploadConstruct
     * @description Getter for Application fileupload
     * @returns {express.RequestHandler} fileUpload
     * @private
     */
    private get fileUploadConstruct(): express.RequestHandler {

        return fileUpload({
            limits: { fileSize: 8 * 1024 * 1024 },
            limitHandler
        });

    }

    /**
     * @name setUpUses
     * @description SetUp Application uses
     * @returns {boolean} true
     * @private
     */
    private get setUpUses(): boolean {

        try {

            this.server.use(express.json());
            this.server.use(express.urlencoded({ extended: true }));
            this.server.use(this.fileUploadConstruct);
            this.server.use(express.static(`./public`));

        } catch (e) {
            throw e;
        }

        return true;

    }

    /**
     * @name setUpUses
     * @description SetUp Application sets
     * @returns {boolean} true
     * @private
     */
    private get setUpSets(): boolean {

        try {

            if (process.platform === 'win32') this.server.set('json spaces', 4);
            this.server.set('views', `./views`);
            this.server.set('view engine', 'pug');

        } catch (e) {
            throw e;
        }

        return true;

    }

    /**
     * @name run
     * @description Start Application
     * @param {number} callback
     * @returns {port: number} Application used port
     */
    public run(callback: (port: number) => unknown): void {

        this.server.listen(this.port, () => {
            callback(this.port);
            this.log.ready('Application started! run callback returned.');
        });

    }

}