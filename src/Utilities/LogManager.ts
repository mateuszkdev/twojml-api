// imports
import fs from 'fs';
import dayjs from 'dayjs';

/**
 * @name LogsManager
 * @description Manage logs file
 */
export default class LogsManager {

    private fileName: string;
    private dirName: string;

    /**
     * @description Create LogsManager
     */
    constructor() {

        // Files and dirs names
        this.fileName = `twoj.ml-${dayjs(Date.now()).format('YYYY-MM-DD')}.log`;
        this.dirName = `./logs/`;

        // Prepare dir
        if (!fs.existsSync(this.dirName)) fs.mkdirSync(this.dirName);
        this.dirName += this.fileName;

        // Prepare file
        if (!fs.existsSync(this.dirName)) fs.writeFileSync(this.dirName, '');

    }

    /**
     * @name addLog
     * @description Add log into file
     * @param {string} data
     * @returns {*}
     */
    public addLog(data: string): void {

        const content = fs.readFileSync(this.dirName, 'utf-8');
        fs.appendFileSync(this.dirName, (content.length ? '\n': '') + data);

    }

}