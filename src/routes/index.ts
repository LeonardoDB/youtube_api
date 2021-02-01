import { Router } from 'express';

import searchRouter from './search.routes';

const routes = Router();

routes.use('/search', searchRouter);

export default routes;
