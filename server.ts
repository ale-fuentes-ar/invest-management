import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { db } from "./src/db/index";
import { users, portfolios, assets, operations } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialization: ensure default user and portfolio exist
  let defaultUser = db.select().from(users).where(eq(users.email, 'default@example.com')).get();
  if (!defaultUser) {
    db.insert(users).values({ name: 'Default User', email: 'default@example.com', passwordHash: 'hash', createdAt: new Date() }).run();
    defaultUser = db.select().from(users).where(eq(users.email, 'default@example.com')).get();
  }
  let defaultPortfolio = db.select().from(portfolios).where(eq(portfolios.userId, defaultUser!.id)).get();
  if (!defaultPortfolio) {
    db.insert(portfolios).values({ userId: defaultUser!.id, name: 'Main Portfolio' }).run();
    defaultPortfolio = db.select().from(portfolios).where(eq(portfolios.userId, defaultUser!.id)).get();
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/dashboard", (req, res) => {
    const allOps = db.select({
      operationType: operations.operationType,
      quantity: operations.quantity,
      price: operations.price
    }).from(operations).all();

    let totalInvested = 0;
    let realizedProfit = 0;

    for (const op of allOps) {
      if (op.operationType === 'BUY') {
        totalInvested += (op.quantity * op.price);
      } else if (op.operationType === 'SELL') {
        totalInvested -= (op.quantity * op.price);
        realizedProfit += 150; // Simplified calculation
      }
    }

    const portfolioValue = totalInvested > 0 ? totalInvested * 1.05 : 0;
    const unrealizedProfit = portfolioValue - totalInvested;

    res.json({
      totalInvested,
      portfolioValue,
      unrealizedProfit,
      realizedProfit,
      monthlyIncome: totalInvested * 0.008, // Mock dividend yield
      taxPayable: realizedProfit > 0 ? realizedProfit * 0.15 : 0 // Mock 15% tax
    });
  });

  app.get("/api/assets", (req, res) => {
    const allOps = db.select({
      assetId: operations.assetId,
      ticker: assets.ticker,
      assetType: assets.assetType,
      operationType: operations.operationType,
      quantity: operations.quantity,
      price: operations.price
    }).from(operations).innerJoin(assets, eq(operations.assetId, assets.id)).all();

    const assetMap = new Map();
    for (const op of allOps) {
      if (!assetMap.has(op.ticker)) {
        assetMap.set(op.ticker, { id: op.assetId, ticker: op.ticker, assetType: op.assetType, quantity: 0, totalCost: 0, currentPrice: op.price * 1.02, targetPercentage: 10, currentPercentage: 0 });
      }
      const a = assetMap.get(op.ticker);
      if (op.operationType === 'BUY') {
        a.quantity += op.quantity;
        a.totalCost += (op.quantity * op.price);
      } else if (op.operationType === 'SELL') {
        a.quantity -= op.quantity;
        const avgCost = a.quantity > 0 ? a.totalCost / (a.quantity + op.quantity) : 0;
        a.totalCost -= (op.quantity * avgCost);
      }
    }

    let totalValue = 0;
    const holdings = Array.from(assetMap.values()).filter(a => a.quantity > 0).map(a => {
      a.averagePrice = a.totalCost / a.quantity;
      a.marketValue = a.quantity * a.currentPrice;
      totalValue += a.marketValue;
      return a;
    });

    holdings.forEach(a => {
      a.currentPercentage = totalValue > 0 ? (a.marketValue / totalValue) * 100 : 0;
    });

    res.json(holdings);
  });

  app.get("/api/operations", (req, res) => {
    const ops = db.select({
      id: operations.id,
      ticker: assets.ticker,
      operationType: operations.operationType,
      quantity: operations.quantity,
      price: operations.price,
      date: operations.settlementDate
    }).from(operations).innerJoin(assets, eq(operations.assetId, assets.id)).all();
    
    // Sort descending by date
    ops.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(ops);
  });

  app.post("/api/operations", (req, res) => {
    try {
      const { ticker, assetType, operationType, quantity, price, date } = req.body;
      const upperTicker = ticker.toUpperCase();
      
      let asset = db.select().from(assets).where(eq(assets.ticker, upperTicker)).get();
      if (!asset) {
        const result = db.insert(assets).values({ ticker: upperTicker, assetType, sector: 'Unknown' }).run();
        asset = { id: result.lastInsertRowid as number, ticker: upperTicker, assetType };
      }
      
      db.insert(operations).values({
        portfolioId: defaultPortfolio!.id,
        assetId: asset.id,
        operationType,
        quantity: Number(quantity),
        price: Number(price),
        settlementDate: new Date(date)
      }).run();
      
      res.json({ success: true });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const { prompt } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
