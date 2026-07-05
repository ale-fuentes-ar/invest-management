import React, { useEffect, useState } from 'react';
import { fetchAssets } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function PortfolioPage() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetchAssets().then(setAssets).catch(console.error);
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Portfolio</h2>
      </div>

      <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-white font-semibold">Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-b border-white/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-slate-500 font-medium pb-2">Ticker</TableHead>
                <TableHead className="text-slate-500 font-medium pb-2">Type</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Quantity</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Avg Price</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Current Price</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Market Value</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">P/L %</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Current %</TableHead>
                <TableHead className="text-slate-500 font-medium text-right pb-2">Target %</TableHead>
                <TableHead className="text-slate-500 font-medium text-center pb-2">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => {
                const marketValue = asset.quantity * asset.currentPrice;
                const pl = ((asset.currentPrice - asset.averagePrice) / asset.averagePrice) * 100;
                const diff = asset.currentPercentage - asset.targetPercentage;
                
                let recommendation = <Minus className="w-4 h-4 mx-auto text-slate-500" />;
                if (diff < -2) recommendation = <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded border border-blue-500/30">Buy</span>;
                else if (diff > 2) recommendation = <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] rounded border border-rose-500/30">Sell</span>;
                else recommendation = <span className="px-2 py-0.5 bg-slate-500/20 text-slate-400 text-[10px] rounded border border-slate-500/30">Hold</span>;

                return (
                  <TableRow key={asset.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-bold text-white py-3">{asset.ticker}</TableCell>
                    <TableCell className="py-3 text-slate-400">{asset.assetType}</TableCell>
                    <TableCell className="text-right py-3">{asset.quantity}</TableCell>
                    <TableCell className="text-right py-3 font-mono">{formatCurrency(asset.averagePrice)}</TableCell>
                    <TableCell className="text-right py-3 font-mono">{formatCurrency(asset.currentPrice)}</TableCell>
                    <TableCell className="text-right py-3 text-white font-bold">{formatCurrency(marketValue)}</TableCell>
                    <TableCell className={`text-right py-3 font-bold flex items-center justify-end gap-1 ${pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(pl).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right py-3">{asset.currentPercentage.toFixed(1)}%</TableCell>
                    <TableCell className="text-right py-3 text-slate-500">{asset.targetPercentage.toFixed(1)}%</TableCell>
                    <TableCell className="text-center w-24 py-3">
                      {recommendation}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
