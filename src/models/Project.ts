import mongoose, { Schema } from 'mongoose';

// Define el esquema para los campos adjuntos (opcional)
const AdjuntoSchema = new Schema({
  nombreArchivo: { type: String, required: true },
  url: { type: String, required: true }, // O la forma en que almacenes las URLs de los adjuntos
  fechaCarga: { type: Date, default: Date.now }
});

// Define el esquema para el modelo de Proyecto
const ProyectoSchema = new Schema({
  propietarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client' // 👈  REFERENCIA A LA COLECCIÓN 'Client' (o 'Clients', ajusta si es necesario)
  },
  nombreProyecto: { type: String, required: true },
  descripcionProyecto: { type: String },
  ubicacion: {
    calle: { type: String, required: true },
    localidad: { type: String, required: true },
    provincia: { type: String, required: true },
    codigoPostal: { type: String },
    pais: { type: String, required: true },
    latitud: { type: Number },
    longitud: { type: Number }
  },
  tipoProyecto: {
    type: String,
    enum: ['Vivienda Unifamiliar', 'Vivienda Multifamiliar', 'Ampliación/Remodelación', 'Otro'],
    required: true
  },
  sistemaConstructivo: {
    type: String,
    enum: ['Tradicional (ladrillo, hormigón)', 'Prefabricado', 'Steel Framing', 'Wood Framing', 'Otro'],
    required: true
  },
  superficieEstimada: { type: Number, required: true, min: 0 },
  cantidadPlantas: { type: Number, min: 0, default: 1 },
  fechaInicioEstimada: { type: Date },
  fechaFinEstimada: { type: Date },
  monedaPresupuesto: { type: String, required: true, default: 'USD' }, // Puedes establecer una moneda por defecto
  estadoProyecto: {
    type: String,
    enum: ['Planificación', 'En Curso', 'Pausado', 'Finalizado'],
    required: true,
    default: 'Planificación' // Estado inicial por defecto
  },
  arquitecto: { type: String },
  ingeniero: { type: String },
  numeroExpedienteMunicipal: { type: String },
  adjuntos: { type: [AdjuntoSchema], default: [] }, // Array de adjuntos, usando el sub-esquema AdjuntoSchema
  usuarioCreadorId: { // Para auditoría y permisos, si lo necesitas
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario' // Asume que tienes un modelo/colección llamado 'Usuario'
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Define el modelo 'Proyecto' utilizando el esquema
const Proyecto = mongoose.models.Proyecto || mongoose.model('Proyecto', ProyectoSchema);

export default Proyecto;