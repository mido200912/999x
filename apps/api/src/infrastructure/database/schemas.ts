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
  organizationName: string; category: 'STARTUP' | 'VOLUNTEER_TEAM' | 'EVENT';
  brandColor?: string; logoUrl?: string;
  primaryContact: { name: string; email: string; phone: string; whatsappPhone?: string; };
  operationalStage: 'DIAGNOSIS' | 'RESTRUCTURING' | 'EXECUTION' | 'COMPLETED';
  healthScore: number; assignedOpsLead: Types.ObjectId;
  tokenBudget: { monthlyLimit: number; tokensUsed: number; }; createdAt: Date; updatedAt: Date;
}
const ClientSchema = new Schema<IClientDocument>({
  organizationName: { type: String, required: true, trim: true, index: true },
  category: { type: String, enum: ['STARTUP', 'VOLUNTEER_TEAM', 'EVENT'], required: true },
  brandColor: { type: String, default: '#A3E635' }, logoUrl: String,
  primaryContact: {
    name: { type: String, required: true }, email: { type: String, required: true },
    phone: { type: String, required: true }, whatsappPhone: String,
  },
  operationalStage: { type: String, enum: ['DIAGNOSIS','RESTRUCTURING','EXECUTION','COMPLETED'], default: 'DIAGNOSIS', index: true },
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

export const UserModel = model<IUserDocument>('User', UserSchema);
export const ClientModel = model<IClientDocument>('Client', ClientSchema);
export const SubmissionModel = model<ISubmissionDocument>('Submission', SubmissionSchema);
export const AIReportModel = model<IAIReportDocument>('AIReport', AIReportSchema);
export const TaskModel = model<ITaskDocument>('Task', TaskSchema);
export const TicketModel = model<ITicketDocument>('Ticket', TicketSchema);
export const AuditLogModel = model<IAuditLogDocument>('AuditLog', AuditLogSchema);
