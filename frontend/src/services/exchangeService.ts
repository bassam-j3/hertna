import { apiFetch } from './apiClient';

export interface SwapRecord {
  id: string;
  title: string;
  startDate: string;
  dueDate: string;
  status: 'active' | 'pending' | 'completed';
  postId?: string;
  borrowerId: string;
  lenderId: string;
  borrower?: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    city?: string;
    neighborhood?: string;
  };
  lender?: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    city?: string;
    neighborhood?: string;
  };
  post?: {
    image?: string;
  };
}

export interface MySwapsResponse {
  asBorrower: SwapRecord[];
  asLender: SwapRecord[];
}

export async function createExchangeRequest(postId: string, title: string, startDate: string, dueDate: string) {
  return apiFetch<SwapRecord>('/swaps', {
    method: 'POST',
    body: JSON.stringify({ postId, title, startDate, dueDate }),
  });
}

export async function updateExchangeStatus(exchangeId: string, status: string) {
  return apiFetch<SwapRecord>(`/swaps/${exchangeId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchMyLoans() {
  return apiFetch<MySwapsResponse>(`/swaps/my-swaps`);
}
