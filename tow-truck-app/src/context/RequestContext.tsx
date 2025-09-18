import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TowRequest } from '@/types';
import { loadRequests, saveRequests } from '@/storage/storage';

type RequestContextType = {
  requests: TowRequest[];
  createRequest: (data: Omit<TowRequest, 'id' | 'createdAt' | 'status'>) => Promise<TowRequest>;
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<TowRequest[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadRequests();
      setRequests(loaded);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    (async () => {
      await saveRequests(requests);
    })();
  }, [requests, isReady]);

  const createRequest: RequestContextType['createRequest'] = async (data) => {
    const newReq: TowRequest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      status: 'отправлена',
      ...data,
    };
    setRequests((cur) => [newReq, ...cur]);
    return newReq;
  };

  const value = useMemo(() => ({ requests, createRequest }), [requests]);

  if (!isReady) return null;

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

export function useRequests(): RequestContextType {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequests must be used within RequestProvider');
  return ctx;
}

