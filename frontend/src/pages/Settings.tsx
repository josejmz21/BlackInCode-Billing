import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, HelpCircle, Save, Sliders, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [companyName, setCompanyName] = useState('BlackInCode Consulting S.C.');
  const [rfc, setRfc] = useState('BIC120405TX4');
  const [address, setAddress] = useState('Paseo de la Reforma 250, CDMX, Mexico');
  const [cfdiCertificate] = useState('BIC120405TX4_certificate.cer');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm">Configure your billing profile, CFDI digital keys, and invoice automation.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Navigation / Cards */}
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-card cursor-pointer border-primary/50 border shadow-md">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
              <Sliders className="w-5 h-5 text-primary shrink-0" />
              <div>
                <CardTitle className="text-sm font-semibold">General Billing</CardTitle>
                <CardDescription className="text-xs">Business entity and address.</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-card cursor-pointer hover:border-primary/30 border transition-all">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary/70 shrink-0" />
              <div>
                <CardTitle className="text-sm font-semibold">Tax Certificates (CSD)</CardTitle>
                <CardDescription className="text-xs">Keys and certificates for PAC signing.</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-card cursor-pointer hover:border-primary/30 border transition-all">
            <CardHeader className="p-4 flex flex-row items-center gap-3">
              <HelpCircle className="w-5 h-5 text-primary/70 shrink-0" />
              <div>
                <CardTitle className="text-sm font-semibold">Support & Help</CardTitle>
                <CardDescription className="text-xs">Official PAC status & support desk.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Content Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSave}>
            <Card className="bg-card border shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>General Billing Preferences</CardTitle>
                <CardDescription>Enter details that will be officially stamped onto your issued CFDIs.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Business / Corporate Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="rfc">RFC (Official Tax ID)</Label>
                    <Input
                      id="rfc"
                      value={rfc}
                      className="font-mono"
                      onChange={(e) => setRfc(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cert">CSD Certificate Status</Label>
                    <Input
                      id="cert"
                      value={cfdiCertificate}
                      disabled
                      className="font-mono text-muted-foreground bg-muted text-xs shrink-0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Official Fiscal Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-6 bg-muted/10">
                <div className="flex items-center text-xs text-muted-foreground">
                  {isSaved && (
                    <span className="flex items-center gap-1.5 text-green-500 font-semibold animate-pulse">
                      <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully!
                    </span>
                  )}
                </div>
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Profile
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
