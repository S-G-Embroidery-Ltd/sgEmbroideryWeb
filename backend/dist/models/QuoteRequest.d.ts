import mongoose, { Document } from 'mongoose';
export interface IQuoteRequest extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    company?: string;
    description: string;
    quantity?: string;
    timeline?: string;
    specialInstructions?: string;
    referenceFile?: string;
    status: 'submitted' | 'reviewed' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IQuoteRequest, {}, {}, {}, mongoose.Document<unknown, {}, IQuoteRequest, {}, {}> & IQuoteRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=QuoteRequest.d.ts.map