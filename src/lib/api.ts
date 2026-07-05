export const fetchDashboardStats = async () => {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
};

export const fetchAssets = async () => {
  const res = await fetch('/api/assets');
  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
};

export const fetchOperations = async () => {
  const res = await fetch('/api/operations');
  if (!res.ok) throw new Error('Failed to fetch operations');
  return res.json();
};

export const askAiAssistant = async (prompt: string) => {
  const res = await fetch('/api/gemini/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('Failed to fetch AI response');
  return res.json();
};
