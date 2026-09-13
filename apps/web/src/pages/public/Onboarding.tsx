import { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { registerClient } from '../../lib/api';
import { Building2, User, Phone, AlignLeft, Briefcase, CheckCircle, Mail, Calendar, DollarSign, Users, Plus, X } from 'lucide-react';

export default function Onboarding() {
  const [orgName, setOrgName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [companyType, setCompanyType] = useState('STARTUP');
  const [companyTypeCustom, setCompanyTypeCustom] = useState('');
  const [description, setDescription] = useState('');
  
  // Contact
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Event Specific Fields
  const [expectedDate, setExpectedDate] = useState('');
  const [budget, setBudget] = useState('');
  const [attendeesCount, setAttendeesCount] = useState('');

  // Custom Details
  const [customDetails, setCustomDetails] = useState<{ key: string; value: string }[]>([]);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const addCustomDetail = () => setCustomDetails([...customDetails, { key: '', value: '' }]);
  const removeCustomDetail = (i: number) => setCustomDetails(customDetails.filter((_, idx) => idx !== i));
  const updateCustomDetail = (i: number, field: 'key' | 'value', val: string) => {
    const newDetails = [...customDetails];
    newDetails[i][field] = val;
    setCustomDetails(newDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !contactName.trim() || !phone.trim() || !email.trim()) {
      setErr('Please fill in all required fields (marked with *).');
      return;
    }
    if (companyType === 'OTHER' && !companyTypeCustom.trim()) {
      setErr('Please specify your custom company type.');
      return;
    }
    if (companyType !== 'OTHER' && !subtitle.trim()) {
      setErr('Please fill in the field / industry.');
      return;
    }

    setLoading(true);
    setErr('');
    try {
      await registerClient({
        organizationName: orgName,
        subtitle: companyType === 'OTHER' ? companyTypeCustom : subtitle,
        description,
        companyType,
        companyTypeCustom: companyType === 'OTHER' ? companyTypeCustom : undefined,
        eventDetails: companyType === 'EVENT' ? { expectedDate, budget, attendeesCount } : undefined,
        customDetails: customDetails.filter(d => d.key.trim() && d.value.trim()),
        primaryContact: {
          name: contactName,
          email,
          phone,
        },
      });
      setDone(true);
    } catch (error: any) {
      setErr(error.message || 'An error occurred while saving your data.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center py-12">
          <div className="w-20 h-20 rounded-full bg-lime/15 border border-lime/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(138,154,91,0.3)]">
            <CheckCircle className="w-10 h-10 text-lime" />
          </div>
          <h2 className="font-display font-black text-pistachio text-[24px] mb-2">Data Submitted Successfully</h2>
          <p className="text-white/40 text-[14px] mb-8">
            Thank you! Your company details have been securely transmitted to the 999x Operations Team. We will contact you shortly.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-12 px-5 sm:px-8">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-[0_0_30px_rgba(163,230,53,0.1)]">
            <Building2 className="w-8 h-8 text-lime" />
          </div>
          <h1 className="font-display font-black text-[32px] text-pistachio tracking-tight">Client Registration</h1>
          <p className="text-white/40 text-[14px] mt-2">Please provide your details to set up your operational environment.</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Core Details ── */}
            <div className="space-y-6">
              <h3 className="text-lime font-mono text-[12px] tracking-widest border-b border-white/10 pb-2">1. CORE DETAILS</h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                    <Building2 className="w-3 h-3" /> ORGANIZATION NAME *
                  </label>
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                    <Briefcase className="w-3 h-3" /> COMPANY TYPE *
                  </label>
                  <select
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors appearance-none"
                  >
                    <option value="STARTUP">Startup / Tech</option>
                    <option value="EVENT">Event / Conference</option>
                    <option value="VOLUNTEER_TEAM">Volunteer Team</option>
                    <option value="OTHER">Other...</option>
                  </select>
                </div>

                {companyType === 'OTHER' ? (
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                      <AlignLeft className="w-3 h-3" /> SPECIFY TYPE *
                    </label>
                    <input
                      value={companyTypeCustom}
                      onChange={(e) => setCompanyTypeCustom(e.target.value)}
                      placeholder="e.g. NGO, Restaurant Chain"
                      className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                      <Briefcase className="w-3 h-3" /> FIELD / INDUSTRY *
                    </label>
                    <input
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. FinTech, Mega Conference"
                      className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Event Details (Conditional) ── */}
            {companyType === 'EVENT' && (
              <div className="space-y-6 animate-in">
                <h3 className="text-lime font-mono text-[12px] tracking-widest border-b border-white/10 pb-2">2. EVENT DETAILS</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                      <Calendar className="w-3 h-3" /> TARGET DATE
                    </label>
                    <input
                      type="date"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                      <DollarSign className="w-3 h-3" /> EXPECTED BUDGET
                    </label>
                    <input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 500k EGP"
                      className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                      <Users className="w-3 h-3" /> ATTENDEES
                    </label>
                    <input
                      value={attendeesCount}
                      onChange={(e) => setAttendeesCount(e.target.value)}
                      placeholder="e.g. 1500+"
                      className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Contact Details ── */}
            <div className="space-y-6">
              <h3 className="text-lime font-mono text-[12px] tracking-widest border-b border-white/10 pb-2">
                {companyType === 'EVENT' ? '3. CONTACT DETAILS' : '2. CONTACT DETAILS'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                    <User className="w-3 h-3" /> YOUR NAME / ROLE *
                  </label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe / CEO"
                    className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                    <Mail className="w-3 h-3" /> EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                    <Phone className="w-3 h-3" /> CONTACT NUMBER *
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 000 0000"
                    dir="ltr"
                    className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* ── Extra Information ── */}
            <div className="space-y-6">
              <h3 className="text-lime font-mono text-[12px] tracking-widest border-b border-white/10 pb-2">
                {companyType === 'EVENT' ? '4. ADDITIONAL INFO' : '3. ADDITIONAL INFO'}
              </h3>
              
              <div>
                <label className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-2 ml-1">
                  <AlignLeft className="w-3 h-3" /> GENERAL DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional details about your goals or challenges..."
                  rows={4}
                  className="w-full p-4 rounded-xl bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors resize-y"
                />
              </div>

              {/* Dynamic Custom Details */}
              <div>
                <label className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-2 ml-1">
                  <span>CUSTOM DETAILS (OPTIONAL)</span>
                  <button type="button" onClick={addCustomDetail} className="text-lime hover:text-lime/80 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Field
                  </button>
                </label>
                
                {customDetails.length > 0 && (
                  <div className="space-y-3 mt-3">
                    {customDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3 animate-in">
                        <input
                          value={detail.key}
                          onChange={(e) => updateCustomDetail(idx, 'key', e.target.value)}
                          placeholder="Detail Name (e.g. Venue)"
                          className="w-1/3 h-10 rounded-lg px-3 bg-canvas border border-white/10 text-pistachio text-[13px] focus:border-lime/50 outline-none"
                        />
                        <input
                          value={detail.value}
                          onChange={(e) => updateCustomDetail(idx, 'value', e.target.value)}
                          placeholder="Value..."
                          className="flex-1 h-10 rounded-lg px-3 bg-canvas border border-white/10 text-pistachio text-[13px] focus:border-lime/50 outline-none"
                        />
                        <button type="button" onClick={() => removeCustomDetail(idx)} className="h-10 px-2 text-red-400 hover:text-red-300">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {err && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] text-center animate-in">
                {err}
              </div>
            )}

            <div className="pt-4">
              <NeoButton type="submit" disabled={loading} className="w-full h-14 text-[16px]">
                {loading ? 'Submitting Data...' : 'Submit Registration Request'}
              </NeoButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
