"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required() {
            return !this.googleId && !this.clerkId;
        },
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function (password) {
                // At least one uppercase letter
                if (!/[A-Z]/.test(password))
                    return false;
                // At least one lowercase letter
                if (!/[a-z]/.test(password))
                    return false;
                // At least one number
                if (!/\d/.test(password))
                    return false;
                // At least one special character
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
                    return false;
                return true;
            },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        },
        select: false,
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true,
    },
    clerkId: {
        type: String,
        sparse: true,
        unique: true,
    },
    provider: {
        type: String,
        enum: ['email', 'google', 'clerk'],
        default: 'email',
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    favorites: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product',
        }],
    orders: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Order',
        }],
    resetToken: {
        type: String,
        select: false,
    },
    resetTokenExpiry: {
        type: Date,
        select: false,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const pwd = this.get('password');
    if (!pwd)
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.set('password', await bcryptjs_1.default.hash(pwd, salt));
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    const pwd = this.get('password');
    if (!pwd)
        return false;
    return bcryptjs_1.default.compare(candidatePassword, pwd);
};
// Index for better query performance (email, googleId, clerkId already have unique indexes)
userSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map