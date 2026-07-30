import { Request, Response, NextFunction } from 'express';
import { ConverterService } from './converter.service';

const converterService = new ConverterService();

export class ConverterController {
  public async handleConvert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sourceBookie, targetBookie, sourceCode } = req.body;

      if (!sourceBookie || !targetBookie || !sourceCode) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameters: sourceBookie, targetBookie, and sourceCode are required.'
        });
        return;
      }

      const result = await converterService.convertCode({
        sourceBookie,
        targetBookie,
        sourceCode
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
