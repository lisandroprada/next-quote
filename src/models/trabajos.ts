import mongoose, { Document, Schema, Types } from 'mongoose';

export interface FormField {
  name: string;
  label: string;
  fieldType: 'number' | 'text' | 'select' | 'checkbox' | 'date';
  unit?: string;
  required: boolean;
  options?: string[];
}

export interface Trabajo extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  formFields: FormField[];
  order: number;
  itemCount?: number;
  status?: 'active' | 'archived' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<FormField>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  fieldType: { 
    type: String, 
    enum: ['number', 'text', 'select', 'checkbox', 'date'], 
    required: true 
  },
  unit: { type: String },
  required: { type: Boolean, default: false },
  options: { type: [String] }
});

const TrabajoSchema = new Schema<Trabajo>({
  name: { type: String, required: true },
  description: { type: String },
  formFields: { type: [FormFieldSchema], default: [] },
  order: { type: Number, default: 0 },
  itemCount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.models.Trabajo || mongoose.model<Trabajo>('Trabajo', TrabajoSchema);
