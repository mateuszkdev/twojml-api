// imports
import Application from './Structures/Application/App';

// .env import and setup
import { config } from 'dotenv';
config();

export const app = new Application({ dirname: __dirname, port: process.env.PORT });
app.run((port) => console.log(`Server running on port ${port}`));