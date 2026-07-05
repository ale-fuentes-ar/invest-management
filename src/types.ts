export type AssetType = 'STOCK' | 'FII' | 'WIN' | 'WDO';
export type OperationType = 'BUY' | 'SELL' | 'DIVIDEND' | 'SPLIT' | 'REVERSE_SPLIT' | 'BONUS' | 'FUTURES_TRADE' | 'FEE' | 'TAX';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Portfolio {
  id: number;
  userId: number;
  name: string;
}

export interface Asset {
  id: number;
  ticker: string;
  assetType: AssetType;
  sector?: string;
}

export interface Operation {
  id: number;
  portfolioId: number;
  assetId: number;
  operationType: OperationType;
  quantity: number;
  price: number;
  brokerageFees: number;
  taxes: number;
  settlementDate: string;
}

export interface TargetAllocation {
  id: number;
  portfolioId: number;
  assetType: AssetType;
  targetPercentage: number;
}

export interface DashboardStats {
  totalInvested: number;
  portfolioValue: number;
  unrealizedProfit: number;
  realizedProfit: number;
  monthlyIncome: number;
  taxPayable: number;
}
