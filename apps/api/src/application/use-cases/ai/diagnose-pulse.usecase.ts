import { ok, type Result } from '../../core/contracts/index.js';
import { HealthScore } from '../../../core/value-objects/health-score.vo.js';

export type PulseInput = { category:'STARTUP'|'VOLUNTEER_TEAM'|'EVENT'; pains:string[]; teamSize:number };
export type PulseOutput = { hr:number; churn:number; sponsor:number; exec:number; health:number; brief:string };

export async function diagnosePulse(input: PulseInput): Promise<Result<PulseOutput>> {
  let hr=75, churn=22, sponsor=65, exec=70;
  if (input.category==='STARTUP'){ sponsor+=10; exec+=5; hr-=5; }
  else if (input.category==='VOLUNTEER_TEAM'){ churn+=14; hr-=12; sponsor-=8; }
  else if (input.category==='EVENT'){ sponsor+=12; exec+=8; hr-=4; }
  const map:any={ churn:{hr:-15,churn:18,sponsor:-4,exec:-8}, hierarchy:{hr:-18,churn:10,sponsor:-6,exec:-14}, sponsor:{hr:-2,churn:2,sponsor:-20,exec:-4}, delivery:{hr:-6,churn:6,sponsor:-4,exec:-18}};
  for(const p of input.pains){ const imp=map[p]; if(imp){ hr+=imp.hr; churn+=imp.churn; sponsor+=imp.sponsor; exec+=imp.exec; } }
  if(input.teamSize>60){ hr-=4; churn+=6; }
  const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,Math.round(n)));
  hr=clamp(hr,25,95); churn=clamp(churn,10,75); sponsor=clamp(sponsor,25,95); exec=clamp(exec,30,95);
  const health = HealthScore.compute(hr, churn, sponsor, exec).value;
  const brief = `Pulse ${health} — HR ${hr}% | Churn ${churn}% | Sponsor ${sponsor}% | Velocity ${exec}%`;
  return ok({ hr,churn,sponsor,exec, health, brief });
}

