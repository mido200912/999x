/**
 * scripts/seed.ts — Seed demo data for 999x
 * Creates: 1 admin, 1 ops member, 1 demo client + user
 * Run: bun src/scripts/seed.ts
 */
import { connectDB } from '../infrastructure/database/connection.js';
import { UserModel, ClientModel } from '../infrastructure/database/schemas.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();
  console.log('[seed] clearing old demo...');
  await UserModel.deleteMany({ email: { $in: ['admin@999x.earth', 'ops@999x.earth', 'demo@team.com'] } });
  await ClientModel.deleteMany({ organizationName: 'Demo Team' });

  const adminHash = await bcrypt.hash('admin123', 10);
  const opsHash = await bcrypt.hash('ops12345', 10);
  const clientHash = await bcrypt.hash('demo1234', 10);

  const admin = await UserModel.create({
    email: 'admin@999x.earth',
    passwordHash: adminHash,
    fullName: 'Admin Demo',
    role: 'SUPER_ADMIN',
  });
  console.log('[seed] admin:', admin.email, 'pass: admin123');

  const ops = await UserModel.create({
    email: 'ops@999x.earth',
    passwordHash: opsHash,
    fullName: 'Ops Member',
    role: 'OPS_MEMBER',
  });
  console.log('[seed] ops:', ops.email, 'pass: ops12345');

  const client = await ClientModel.create({
    organizationName: 'Demo Team',
    category: 'STARTUP',
    primaryContact: { name: 'Demo User', email: 'demo@team.com', phone: '+201000000000' },
    operationalStage: 'DIAGNOSIS',
    healthScore: 72,
    assignedOpsLead: admin._id,
  });
  console.log('[seed] client:', client.organizationName, String(client._id));

  await UserModel.create({
    email: 'demo@team.com',
    passwordHash: clientHash,
    fullName: 'Demo User',
    role: 'CLIENT_ADMIN',
    clientId: client._id,
  });
  console.log('[seed] client user: demo@team.com / demo1234');

  console.log('[seed] done — you can now login');
  process.exit(0);
}

seed().catch((e) => {
  console.error('[seed] failed', e);
  process.exit(1);
});
