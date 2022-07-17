// imports
import Application from '../Application/App';
import { connect } from 'mongoose';

export const dbConnect = async (app: Application) => {

    const res = await connect(
        `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`
    );

    if (res instanceof Error) throw res;
    else return true;

}