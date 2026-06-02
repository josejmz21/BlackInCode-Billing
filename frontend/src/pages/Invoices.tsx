import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, CheckCircle2, AlertCircle, Clock, FileDown } from 'lucide-react';

interface Invoice {
  id: string;
  clientName: string;
  rfc: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export default function Invoices() {
  const [searchQuery, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoicesList, setInvoices] = useState<Invoice[]>([
    { id: 'INV-2026-001', clientName: 'Acme Corporation', rfc: 'ACM850101TX3', date: '2026-05-15', amount: 1540.00, status: 'Paid' },
    { id: 'INV-2026-002', clientName: 'Globex Inc', rfc: 'GLO930212TY4', date: '2026-05-18', amount: 890.50, status: 'Pending' },
    { id: 'INV-2026-003', clientName: 'Soylent Corp', rfc: 'SOY781105TZ5', date: '2026-05-20', amount: 2350.00, status: 'Paid' },
    { id: 'INV-2026-004', clientName: 'Initech LLC', rfc: 'INI900403TW1', date: '2026-04-10', amount: 120.00, status: 'Overdue' },
    { id: 'INV-2026-005', clientName: 'Umbrella Corp', rfc: 'UMB670809TA2', date: '2026-05-25', amount: 4800.00, status: 'Pending' },
  ]);

  // Form states for new invoice
  const [clientName, setClientName] = useState('');
  const [rfc, setRfc] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Pending');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !amount) return;

    const newInvoice: Invoice = {
      id: `INV-2026-0${invoicesList.length + 1}`,
      clientName,
      rfc: rfc.toUpperCase() || 'XAXX010101000',
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      status,
    };

    setInvoices([newInvoice, ...invoicesList]);
    setClientName('');
    setRfc('');
    setAmount('');
    setStatus('Pending');
    setShowCreateModal(false);
  };

  const filteredInvoices = invoicesList.filter((invoice) => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.rfc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === 'All' || invoice.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: 'Paid' | 'Pending' | 'Overdue') => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Overdue
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground text-sm">Create, manage and download your CFDI invoices.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, ID, or RFC..."
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((filter) => (
            <Button
              key={filter}
              variant={statusFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter)}
              className="text-xs"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <Card className="bg-card border shadow-lg overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg">Invoice Ledger</CardTitle>
          <CardDescription>Showing {filteredInvoices.length} invoices matching criteria.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="pl-6 w-[140px]">Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>RFC</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center pr-6 w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No invoices found. Try adjusting your filters or create a new invoice.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs text-primary">{invoice.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{invoice.clientName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{invoice.rfc}</TableCell>
                    <TableCell className="text-sm">{invoice.date}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <FileDown className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-card border shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b">
              <CardTitle>Create CFDI Invoice</CardTitle>
              <CardDescription>Issue a new official invoice for tax deduction.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateInvoice}>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="clientName">Client Business Name</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g. Acme Corporation SA de CV"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rfc">RFC (Tax ID)</Label>
                  <Input
                    id="rfc"
                    placeholder="e.g. ACM850101TX3"
                    maxLength={13}
                    className="font-mono"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount ($ MXN)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Initial Status</Label>
                    <select
                      id="status"
                      className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Paid' | 'Pending')}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/20">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create & Issue</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
