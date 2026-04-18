import mongoose, { Document } from 'mongoose';
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: 'physical' | 'embroidery' | 'downloadable';
    sizes?: string[];
    colors?: string[];
    images: string[];
    inStock: boolean;
    featured: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map