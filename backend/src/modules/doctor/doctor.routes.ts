import { Router, Request, Response, NextFunction } from 'express';
import { DoctorService } from './doctor.service';

const router = Router();
const doctorService = new DoctorService();

router.post('/audit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingCode, sourceBookie } = req.body;
    if (!bookingCode || !sourceBookie) {
      res.status(400).json({ success: false, error: 'bookingCode and sourceBookie are required.' });
      return;
    }
    const result = await doctorService.auditTicket({ bookingCode, sourceBookie });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
