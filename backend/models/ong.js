import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ongSchema = new mongoose.Schema({
  // --- 1. Identity & Public Profile ---
  name: {
    type: String,
    required: [true, 'Please provide your organization\'s name.'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters.'],
  },
  logoUrl: {
    type: String, // URL to the hosted logo image
  },
  bannerUrl: {
    type: String, // URL to a cover photo for their profile page
  },

  // --- 2. Authentication & Security ---
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    lowercase: true,
    trim: true,
    // Basic email regex validation
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false, // Automatically hide this field from query results
  },

  // --- 3. Contact & Location ---
  phoneNumbers: [{
    type: String,
  }],
  website: {
    type: String,
    trim: true,
  },
  socialMedia: {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
  },
  address: {
    street: String,
    city: { type: String, required: [true, 'City is required.'] },
    state: { type: String, required: [true, 'State is required.'], maxlength: 2, uppercase: true },
    zipCode: String,
  },
  // GeoJSON for geospatial queries (e.g., "find pets near me")
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required for location.'],
    },
  },

  // --- 4. Platform Status ---
  // Per your request: "let any ong be legit".
  // It defaults to 'true' but gives you a way to deactivate bad actors later.
  isActive: {
    type: Boolean,
    default: true,
    select: false, // Hide from public API responses
  },

  // --- 5. Password Reset ---
  passwordResetToken: String,
  passwordResetExpires: Date,

}, {
  // --- 6. Timestamps & Virtuals ---
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// --- VIRTUAL RELATIONSHIPS ---
// This is the clean way to get all pets/posts from an ONG
// The ONG schema itself doesn't store a giant array of pet IDs.

// Populate virtuals for pets
ongSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'ong',
});

// Populate virtuals for posts
ongSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'authorOng',
});

// --- INDEXES ---
// Create a geospatial index for location queries
ongSchema.index({ location: '2dsphere' });
// Index on email for faster login queries
ongSchema.index({ email: 1 });

// --- MIDDLEWARE (HOOKS) ---
// Hash password before saving
ongSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// --- INSTANCE METHODS ---
// Method to check password on login
ongSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
ongSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set token expiration to 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed token (to be emailed)
};

export default mongoose.model('Ong', ongSchema);