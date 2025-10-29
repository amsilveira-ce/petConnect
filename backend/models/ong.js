import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'volunteer', 'veterinarian'],
    default: 'volunteer'
  },
  phone: String,
  avatar: String,
  permissions: {
    canManagePets: { type: Boolean, default: false },
    canReviewApplications: { type: Boolean, default: false },
    canPublishPosts: { type: Boolean, default: false },
    canManageTeam: { type: Boolean, default: false }
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const ongSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'ONG name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'ONG name must be at least 3 characters'],
      maxlength: [150, 'ONG name cannot exceed 150 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['ong'],
      default: 'ong'
    },
    logo: {
      type: String,
      default: null
    },
    coverImage: {
      type: String
    },
    mission: {
      type: String,
      maxlength: [300, 'Mission statement cannot exceed 300 characters']
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    adoptionPolicy: {
      type: String,
      maxlength: [3000, 'Adoption policy cannot exceed 3000 characters']
    },
    address: {
      street: { type: String, trim: true, required: true },
      number: { type: String, trim: true },
      complement: { type: String, trim: true },
      neighborhood: { type: String, trim: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      zipCode: { type: String, trim: true, required: true },
      country: { type: String, trim: true, default: 'Brazil' },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        }
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true
    },
    alternativePhone: {
      type: String,
      trim: true
    },
    socialLinks: {
      website: { type: String, trim: true },
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      whatsapp: { type: String, trim: true }
    },
    members: [teamMemberSchema],
    operatingHours: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
    },
    statistics: {
      totalAdoptions: { type: Number, default: 0 },
      activeListings: { type: Number, default: 0 },
      pendingApplications: { type: Number, default: 0 }
    },
    verification: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date,
      documents: [{
        type: { type: String },
        url: String,
        uploadedAt: { type: Date, default: Date.now }
      }]
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    lastLogin: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const ONG = mongoose.model('ONG', ongSchema);
export default ONG;