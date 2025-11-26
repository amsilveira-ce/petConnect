import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
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
      select: false // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user'
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number']
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'Brazil' },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          validate: {
            validator: function(v) {
              // Allow missing or empty coordinates (optional field)
              if (!v || v.length === 0) return true;
              // When provided, must be [lon, lat] and inside valid ranges
              return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
            },
            message: 'Invalid coordinates format'
          }
        }
      }
    },
    profile: {
      avatar: { type: String }, // URL
      bio: { type: String, maxlength: 500 },
      // Pre-fill data for adoption applications
      housingType: {
        type: String,
        enum: ['house', 'apartment', 'farm', 'other']
      },
      hasYard: { type: Boolean },
      hasPets: { type: Boolean },
      currentPets: [{
        species: String,
        breed: String,
        age: Number
      }],
      householdSize: { type: Number, min: 1 },
      hasChildren: { type: Boolean },
      childrenAges: [Number],
      occupation: { type: String },
      workSchedule: { type: String }
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


// --- Exportação ---
const User = mongoose.model('User', userSchema);

export default User;