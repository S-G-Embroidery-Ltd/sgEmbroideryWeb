import type { RequestHandler } from 'express';

/** Public M-Pesa copy for checkout (Till / Pay Bill). */
export const getCheckoutInfo: RequestHandler = (_req, res) => {
  res.json({
    mpesaTill: process.env.MPESA_TILL?.trim() || '',
    mpesaPaybill: process.env.MPESA_PAYBILL?.trim() || '',
    mpesaAccountLabel: process.env.MPESA_ACCOUNT_LABEL?.trim() || '',
  });
};
