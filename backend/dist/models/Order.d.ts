import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    product?: mongoose.Types.ObjectId;
    /** Line title when cart items are not linked to a Product document */
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image?: string;
    customization?: {
        embroideryFile?: string;
        stitchCount?: number;
        placement?: string;
    };
}
export interface IOrderDigitizing {
    logoRelativePath: string;
    originalFileName: string;
    notes?: string;
    company?: string;
    wantStitchingQuote?: string;
    quantity?: string;
}
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    orderType?: 'standard' | 'digitizing';
    digitizing?: IOrderDigitizing;
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentId?: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    shippingAddress: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        postalCode: string;
    };
    orderNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map