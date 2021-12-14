import express, { Request, Response } from 'express';
import cors from 'cors';
import agoraTokenRoute from '../routes/agora-token.route';
import { CustomAuthError, CustomErrorHandler, UnprocessableEntity } from '../middlewares/custom-errors/error-handler.middleware';
import authenticationMiddleware from '../middlewares/authentications/authentication.middleware';
import authRoute from '../routes/auth.route';
import morgan from 'morgan'
import userRoute from '../routes/user.route';
import groupChannelRoute from '../routes/group-channel.route';

const app = express();

app.use(cors());
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
app.set('Expires', '-1')
app.set('Pragma', 'no-cache')
app.use(express.json({ limit: '50mb' }));
app.use(morgan('common'));

app.get('/', (_req: Request, res: Response) => {
  const wellcomeResponse = {
    message: 'OK',
    title: 'PRIVATE MESSENGER API',
    version: '1.0',
    date: new Date(),
    documentations: '',
  };
  res.status(200).json(wellcomeResponse);
});

app.use('/', authRoute.initV1())
app.use('/agora-token', authenticationMiddleware.authenticate, agoraTokenRoute.initV1())
app.use('/users', authenticationMiddleware.authenticate, userRoute.initV1())
app.use('/channels', authenticationMiddleware.authenticate, groupChannelRoute.initV1())

app.use(CustomAuthError)
app.use(UnprocessableEntity)
app.use(CustomErrorHandler)

export default app;
