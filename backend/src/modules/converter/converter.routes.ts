import { Router } from 'express';
import { ConverterController } from './converter.controller';

const router = Router();
const converterController = new ConverterController();

router.post('/convert', (req, res, next) => converterController.handleConvert(req, res, next));

export default router;
