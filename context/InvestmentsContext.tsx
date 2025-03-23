import React, { createContext, useContext, useState } from 'react';

export interface Investment {
  id: string;
  projectId: number | string;
  projectName: string;
  amount: number;
  date: string;
  image: string;
}

interface InvestmentsContextType {
  investments: Investment[];
  addInvestment: (investment: Omit<Investment, 'id' | 'date'>) => void;
}

const InvestmentsContext = createContext<InvestmentsContextType>({
  investments: [],
  addInvestment: () => {},
});

export function InvestmentsProvider({ children }: { children: React.ReactNode }) {
  const [investments, setInvestments] = useState<Investment[]>([]);

  const addInvestment = (investment: Omit<Investment, 'id' | 'date'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
    };
    setInvestments((prev) => [newInvestment, ...prev]);
  };

  return (
    <InvestmentsContext.Provider value={{ investments, addInvestment }}>
      {children}
    </InvestmentsContext.Provider>
  );
}

export const useInvestments = () => useContext(InvestmentsContext);