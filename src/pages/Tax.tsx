import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, AlertCircle } from 'lucide-react';

export default function TaxPage() {
  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Taxes & DARF</h2>
        <Button variant="outline" className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:text-white rounded-2xl">
          <FileText className="w-4 h-4 mr-2" />
          Annual Income Tax Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl col-span-2">
          <CardHeader>
            <CardTitle className="text-white font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Pending DARF Payments
            </CardTitle>
            <CardDescription className="text-slate-400">Monthly tax obligations based on realized profits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-white/10 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">DARF - June 2025</h3>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] rounded border border-rose-500/30">Overdue</span>
                  </div>
                  <p className="text-sm text-slate-400">Swing Trade (Stocks) & Day Trade</p>
                  <p className="text-xs text-slate-500 mt-1">Due Date: July 31, 2025</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Amount</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(120.50)}</p>
                  </div>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl whitespace-nowrap">
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-white/10 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-300">DARF - May 2025</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded border border-emerald-500/30">Paid</span>
                  </div>
                  <p className="text-sm text-slate-400">FIIs (Real Estate Funds)</p>
                  <p className="text-xs text-slate-500 mt-1">Paid on: June 28, 2025</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="text-xl font-bold text-slate-300">{formatCurrency(45.20)}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-white/10 text-slate-300 rounded-2xl">
                    Receipt
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-white font-semibold">Loss Carry-forward</CardTitle>
            <CardDescription className="text-slate-400">Accumulated losses to offset future taxes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Swing Trade</span>
                <span className="font-medium text-white">{formatCurrency(1250.00)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Day Trade</span>
                <span className="font-medium text-white">{formatCurrency(0.00)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">FIIs</span>
                <span className="font-medium text-white">{formatCurrency(450.00)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
