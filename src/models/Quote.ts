import mongoose, { Schema } from 'mongoose';

const QuoteSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  propertyDetails: {
    address: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['house', 'apartment', 'office', 'land', 'other']
    },
    size: {
      type: Number,
      required: true
    },
    bedrooms: {
      type: Number,
      default: 0
    },
    bathrooms: {
      type: Number,
      default: 0
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'needs_work'],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
