import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../lib/api';
import { DashboardStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea'];

const mockAllocationData = [
  { name: 'Stocks', value: 45 },
  { name: 'FIIs', value: 30 },
  { name: 'Fixed Income', value: 15 },
  { name: 'Cash', value: 10 },
];

const mockEvolutionData = [
  { name: 'Jan', value: 140000 },
  { name: 'Feb', value: 145000 },
  { name: 'Mar', value: 148000 },
  { name: 'Apr', value: 155000 },
  { name: 'May', value: 160000 },
  { name: 'Jun', value: 165430 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="text-zinc-400">Loading dashboard...</div>;

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter text-white">{formatCurrency(stats.portfolioValue)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter text-white">{formatCurrency(stats.totalInvested)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unrealized Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter text-emerald-400">+{formatCurrency(stats.unrealizedProfit)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Próxima DARF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tighter text-amber-400">{formatCurrency(stats.taxPayable)}</div>
            <div className="text-slate-400 text-xs mt-1">Vence no final do mês</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white font-semibold">Evolução do Patrimônio</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(12px)' }} />
                <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border-white/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-white font-semibold">Alocação de Ativos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockAllocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {mockAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(12px)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
