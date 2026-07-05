import React, { useEffect, useState } from 'react';
import { fetchOperations } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { FileUp, Plus, Loader2 } from 'lucide-react';

export default function OperationsPage() {
  const [operations, setOperations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [ticker, setTicker] = useState('');
  const [assetType, setAssetType] = useState('STOCK');
  const [operationType, setOperationType] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const loadOperations = () => {
    fetchOperations().then(setOperations).catch(console.error);
  };

  useEffect(() => {
    loadOperations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker,
          assetType,
          operationType,
          quantity: Number(quantity),
          price: Number(price),
          date
        })
      });
      if (!res.ok) throw new Error('Failed to save operation');
      
      setIsOpen(false);
      loadOperations();
      
      // Reset form
      setTicker('');
      setQuantity('');
      setPrice('');
      setDate('');
    } catch (error) {
      console.error(error);
      alert('Error saving operation');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Operations</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:text-white rounded-2xl">
            <FileUp className="w-4 h-4 mr-2" />
            Import PDF (CLEAR)
          </Button>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl">
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-slate-100 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Operation</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticker" className="text-slate-400">Ticker</Label>
                    <Input id="ticker" value={ticker} onChange={e => setTicker(e.target.value)} required placeholder="e.g. PETR4" className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-slate-400">Date</Label>
                    <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500 [color-scheme:dark]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetType" className="text-slate-400">Asset Type</Label>
                    <select id="assetType" value={assetType} onChange={e => setAssetType(e.target.value)} className="flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="STOCK">Stock</option>
                      <option value="FII">FII</option>
                      <option value="BDR">BDR</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operationType" className="text-slate-400">Operation</Label>
                    <select id="operationType" value={operationType} onChange={e => setOperationType(e.target.value)} className="flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option value="BUY">Buy</option>
                      <option value="SELL">Sell</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-slate-400">Quantity</Label>
                    <Input id="quantity" type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} required className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-400">Unit Price</Label>
                    <Input id="price" type="number" min="0.01" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="R$ 0.00" className="bg-white/5 border-white/10 text-white focus-visible:ring-emerald-500" />
                  </div>
                </div>
                
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save Operation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-white font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-slate-500 font-medium pb-2">Date</TableHead>
                <TableHead className="text-slate-500 font-medium pb-2">Ticker</TableHead>
                <TableHead className="text-slate-500 font-medium pb-2">Type</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Quantity</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Price</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((op) => {
                const total = op.quantity * op.price;
                return (
                  <TableRow key={op.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="text-slate-400 py-3">{new Date(op.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-bold text-white py-3">{op.ticker}</TableCell>
                    <TableCell className="py-3">
                      {op.operationType === 'BUY' ? (
                         <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/30">BUY</span>
                      ) : (
                         <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] rounded border border-rose-500/30">SELL</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3">{op.quantity}</TableCell>
                    <TableCell className="text-right py-3 font-mono">{formatCurrency(op.price)}</TableCell>
                    <TableCell className="text-right py-3 text-white font-bold">{formatCurrency(total)}</TableCell>
                  </TableRow>
                );
              })}
              {operations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No operations found. Click "Manual Entry" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
