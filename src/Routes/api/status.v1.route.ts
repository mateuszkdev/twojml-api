import { Route } from 'Types/Route';

export default {

    endpoint: '/v1/status',
    method: 'GET',
    run: async ({ res }) => {

        res.status(200).json({
            status: 200,
            message: 'API OK'
        });

    }

} as Route;