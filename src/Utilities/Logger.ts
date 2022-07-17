// imports
import dayjs from 'dayjs';
import chalk from 'chalk';
import LogsManager from "./LogManager";

/**
 * @name Logger
 * @description Class representing Logs
 */
export default class Logger {

    private prefix: string;
    private logsManager: LogsManager

    /**
     * @description Create Logger
     */
    constructor(prefix: string = '') {

        this.prefix = prefix === '' ? '' : prefix + ': ';
        this.logsManager = new LogsManager();

    }

    /**
     * @name time
     * @description Get current time with dayjs format
     * @returns {string} Time
     * @private
     */
    private get time(): string {
        return dayjs(Date.now()).format('DD.MM.YYYY HH:mm:ss');
    }

    /**
     * @name generateLogTemplate
     * @description Create log string and add to LogManager
     * @param {string} type
     * @param {string} content
     * @returns {string} Log
     * @private
     */
    private generateLogTemplate(type: 'ready' | 'info' | 'warn' | 'error', content: string): string {

        const template = `${this.prefix} { ${type.toUpperCase()} } [${this.time}] → ${content}`;
        this.logsManager.addLog(template);
        return template;

    }

    /**
     * @name send
     * @description Send Log
     * @param {'ready' | 'info' | 'warn' | 'error'} type
     * @param {string} color
     * @param {string} content
     * @returns {*}
     * @private
     */
    private send(type: 'ready' | 'info' | 'warn' | 'error', color: string, content: string): void {
        console.log((chalk as any)[color](this.generateLogTemplate(type, content)));
    }

    /**
     * @name ready
     * @description Send ready log
     * @param {string} content
     * @returns {*}
     */
    public ready(content: string): void {
        this.send('ready', 'green', content);
    }

    /**
     * @name info
     * @description Send info log
     * @param {string} content
     * @returns {*}
     */
    public info(content: string): void {
        this.send('info', 'blue', content);
    }

    /**
     * @name warn
     * @description Send warn log
     * @param {string} content
     * @returns {*}
     */
    public warn(content: string): void {
        this.send('warn', 'orange', content);
    }

    /**
     * @name error
     * @description Send error log
     * @param {string} content
     * @returns {*}
     */
    public error(content: string): void {
        this.send('warn', 'red', content);
    }

}