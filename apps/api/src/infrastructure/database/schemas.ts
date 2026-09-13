// 999x Production MongoDB Schemas — Mirrors md:414-732 (frozen)
import { Schema, model, Document, Types } from 'mongoose';

export interface IUserDocument extends Document {
  email: string; passwordHash: string; fullName: string;
  role: 'SUPER_ADMIN' | 'OPS_MEMBER' | 'CLIENT_ADMIN';
  clientId?: Types.ObjectId; avatarUrl?: string; isActive: boolean; lastLoginAt?: Date; createdAt: Date; updatedAt: Date;
}
const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'OPS_MEMBER', 'CLIENT_ADMIN'], required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', index: true },
  avatarUrl: String, isActive: { type: Boolean, default: true }, lastLoginAt: Date,
}, { timestamps: true });

export interface IClientDocument extends Document {
  organizationName: string; subtitle: string; description?: string;
  brandColor?: string; logoUrl?: string;
  companyType?: string; companyTypeCustom?: string;
  eventDetails?: { expectedDate?: string; budget?: string; attendeesCount?: string; };
  customDetails?: Array<{ key: string; value: string; }>;
  primaryContact: { name: string; email?: string; phone: string; whatsappPhone?: string; };
  operationalStage: 'DIAGNOSIS' | 'RESTRUCTURING' | 'EXECUTION' | 'COMPLETED';
  registrationStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  healthScore: number; assignedOpsLead: Types.ObjectId;
  tokenBudget: { monthlyLimit: number; tokensUsed: number; }; createdAt: Date; updatedAt: Date;
}
const ClientSchema = new Schema<IClientDocument>({
  organizationName: { type: String, required: true, trim: true, index: true },
  subtitle: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  brandColor: { type: String, default: '#A3E635' }, logoUrl: String,
  companyType: String, companyTypeCustom: String,
  eventDetails: { expectedDate: String, budget: String, attendeesCount: String },
  customDetails: [{ key: String, value: String }],
  primaryContact: {
    name: { type: String, required: true }, email: { type: String },
    phone: { type: String, required: true }, whatsappPhone: String,
  },
  operationalStage: { type: String, enum: ['DIAGNOSIS','RESTRUCTURING','EXECUTION','COMPLETED'], default: 'DIAGNOSIS', index: true },
  registrationStatus: { type: String, enum: ['PENDING','ACCEPTED','REJECTED'], default: 'ACCEPTED', index: true },
  healthScore: { type: Number, default: 70, min: 0, max: 100 },
  assignedOpsLead: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenBudget: { monthlyLimit: { type: Number, default: 200000 }, tokensUsed: { type: Number, default: 0 } },
}, { timestamps: true });

export interface ISubmissionDocument extends Document {
  clientId: Types.ObjectId; targetScope: 'HR' | 'PR' | 'SPONSORSHIP' | 'FULL_OPS';
  rawAnswers: Record<string, any>; filesAttached: Array<{ name: string; url: string; sizeBytes: number }>;
  pulseMetrics: { hrStabilityScore: number; churnRiskRate: number; sponsorReadiness: number; executionSpeed: number; };
  aiExecutiveBrief: string; isReviewedByOps: boolean; createdAt: Date;
}
const SubmissionSchema = new Schema<ISubmissionDocument>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  targetScope: { type: String, enum: ['HR','PR','SPONSORSHIP','FULL_OPS'], required: true },
  rawAnswers: { type: Schema.Types.Mixed, required: true },
  filesAttached: [{ name: String, url: String, sizeBytes: Number }],
  pulseMetrics: {
    hrStabilityScore: { type: Number, default: 50 }, churnRiskRate: { type: Number, default: 30 },
    sponsorReadiness: { type: Number, default: 40 }, executionSpeed: { type: Number, default: 60 },
  },
  aiExecutiveBrief: String, isReviewedByOps: { type: Boolean, default: false },
}, { timestamps: true });

export interface IAIReportDocument extends Document {
  clientId: Types.ObjectId; reportType: 'HR_RESTRUCTURING' | 'PR_CAMPAIGN' | 'SPONSOR_PITCH' | 'MONTHLY_AUDIT';
  modelEngine: string; version: number;
  content: { title: string; executiveSummary: string; milestones: Array<{ id: string; title: string; description: string; dueDateOffsetDays: number; assignedRole: string; status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'DONE'; }>; strategicDirectives: string[]; riskMitigations: Array<{ risk: string; solution: string }>; };
  clientApproval: { isApproved: boolean; approvedAt?: Date; clientFeedback?: string; };
  pdfExportUrl?: string; verificationHash: string; createdAt: Date;
}
const AIReportSchema = new Schema<IAIReportDocument>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  reportType: { type: String, enum: ['HR_RESTRUCTURING','PR_CAMPAIGN','SPONSOR_PITCH','MONTHLY_AUDIT'], required: true },
  modelEngine: { type: String, required: true }, version: { type: Number, default: 1 },
  content: {
    title: { type: String, required: true }, executiveSummary: { type: String, required: true },
    milestones: [{ id: { type: String, required: true }, title: { type: String, required: true }, description: { type: String, required: true }, dueDateOffsetDays: { type: Number, default: 7 }, assignedRole: String, status: { type: String, enum: ['PENDING','APPROVED','IN_PROGRESS','DONE'], default: 'PENDING' } }],
    strategicDirectives: [String], riskMitigations: [{ risk: String, solution: String }],
  },
  clientApproval: { isApproved: { type: Boolean, default: false }, approvedAt: Date, clientFeedback: String },
  pdfExportUrl: String, verificationHash: { type: String, required: true, unique: true },
}, { timestamps: true });
AIReportSchema.index({ clientId: 1, reportType: 1, createdAt: -1 });

export interface ITaskDocument extends Document {
  clientId: Types.ObjectId; assignedOpsMember: Types.ObjectId; title: string; details: string;
  columnStatus: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; deadline: Date; timeTrackedMinutes: number;
}
const TaskSchema = new Schema<ITaskDocument>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  assignedOpsMember: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true }, details: String,
  columnStatus: { type: String, enum: ['BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','COMPLETED'], default: 'TODO', index: true },
  priority: { type: String, enum: ['LOW','MEDIUM','HIGH','CRITICAL'], default: 'MEDIUM' },
  deadline: { type: Date, required: true }, timeTrackedMinutes: { type: Number, default: 0 },
}, { timestamps: true });

export interface ITicketDocument extends Document {
  clientId: Types.ObjectId; source: 'WEB_DASHBOARD' | 'WHATSAPP_BOT' | 'TELEGRAM';
  subject: string; description: string; urgency: 'NORMAL' | 'URGENT' | 'CRITICAL_BLOCKER';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED'; aiSuggestedSolution?: string;
  thread: Array<{ senderId: Types.ObjectId; senderName: string; message: string; timestamp: Date; }>;
}
const TicketSchema = new Schema<ITicketDocument>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  source: { type: String, enum: ['WEB_DASHBOARD','WHATSAPP_BOT','TELEGRAM'], default: 'WEB_DASHBOARD' },
  subject: { type: String, required: true }, description: { type: String, required: true },
  urgency: { type: String, enum: ['NORMAL','URGENT','CRITICAL_BLOCKER'], default: 'NORMAL' },
  status: { type: String, enum: ['OPEN','INVESTIGATING','RESOLVED'], default: 'OPEN', index: true },
  aiSuggestedSolution: String,
  thread: [{ senderId: { type: Schema.Types.ObjectId, ref: 'User' }, senderName: String, message: String, timestamp: { type: Date, default: Date.now } }],
}, { timestamps: true });

export interface IAuditLogDocument extends Document {
  actorId: Types.ObjectId; actorEmail: string; action: string; resource: string;
  resourceId?: string; ipAddress: string; userAgent: string; metadata?: Record<string, any>; timestamp: Date;
}
const AuditLogSchema = new Schema<IAuditLogDocument>({
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actorEmail: { type: String, required: true }, action: { type: String, required: true },
  resource: { type: String, required: true }, resourceId: String,
  ipAddress: { type: String, required: true }, userAgent: { type: String, required: true },
  metadata: Schema.Types.Mixed, timestamp: { type: Date, default: Date.now, index: true },
}, { versionKey: false });

export interface ISponsorLeadDocument extends Document {
  clientId: Types.ObjectId; name: string; company: string;
  status: 'INTERESTED' | 'NEGOTIATING' | 'CLOSED_WON' | 'CLOSED_LOST';
  createdAt: Date; updatedAt: Date;
}
const SponsorLeadSchema = new Schema<ISponsorLeadDocument>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, enum: ['INTERESTED','NEGOTIATING','CLOSED_WON','CLOSED_LOST'], default: 'INTERESTED' },
}, { timestamps: true });

export interface IAIStudioRunDocument extends Document {
  clientId: Types.ObjectId; modelEngine: string; prompt: string; response: string;
  tokensUsed: number; latencyMs: number; createdAt: Date;
}
const AIStudioRunSchema = new Schema<IAIStudioRunDocument>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  modelEngine: { type: String, required: true },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  tokensUsed: { type: Number, required: true },
  latencyMs: { type: Number, required: true },
}, { timestamps: true });

export interface IProspectLeadDocument extends Document {
  organizationName: string;
  category: 'STARTUP' | 'VOLUNTEER_TEAM' | 'EVENT' | 'ENTERPRISE';
  contactPerson: string;
  email: string;
  phone: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  pitchAngle?: string;
  estimatedBudget?: string;
  notes?: string;
  convertedClientId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const ProspectLeadSchema = new Schema<IProspectLeadDocument>({
  organizationName: { type: String, required: true, trim: true },
  category: { type: String, enum: ['STARTUP', 'VOLUNTEER_TEAM', 'EVENT', 'ENTERPRISE'], default: 'STARTUP' },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING', index: true },
  pitchAngle: String,
  estimatedBudget: String,
  notes: String,
  convertedClientId: { type: Schema.Types.ObjectId, ref: 'Client' },
}, { timestamps: true });

export interface IApiKeyDocument extends Document {
  name: string;
  keyHash: string;
  prefix: string;
  role: 'READ' | 'WRITE' | 'FULL_ADMIN';
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}
const ApiKeySchema = new Schema<IApiKeyDocument>({
  name: { type: String, required: true },
  keyHash: { type: String, required: true },
  prefix: { type: String, required: true },
  role: { type: String, enum: ['READ', 'WRITE', 'FULL_ADMIN'], default: 'WRITE' },
  lastUsedAt: Date,
  expiresAt: Date,
}, { timestamps: true });

export const UserModel = model<IUserDocument>('User', UserSchema);
export const ClientModel = model<IClientDocument>('Client', ClientSchema);
export const SubmissionModel = model<ISubmissionDocument>('Submission', SubmissionSchema);
export const AIReportModel = model<IAIReportDocument>('AIReport', AIReportSchema);
export const TaskModel = model<ITaskDocument>('Task', TaskSchema);
export const TicketModel = model<ITicketDocument>('Ticket', TicketSchema);
export const AuditLogModel = model<IAuditLogDocument>('AuditLog', AuditLogSchema);
export const SponsorLeadModel = model<ISponsorLeadDocument>('SponsorLead', SponsorLeadSchema);
export const AIStudioRunModel = model<IAIStudioRunDocument>('AIStudioRun', AIStudioRunSchema);
export const ProspectLeadModel = model<IProspectLeadDocument>('ProspectLead', ProspectLeadSchema);
export const ApiKeyModel = model<IApiKeyDocument>('ApiKey', ApiKeySchema);


