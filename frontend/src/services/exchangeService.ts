import { apiFetch } from './apiClient';

export async function createExchangeRequest(postId: string, title: string, startDate: string, dueDate: string) {
  return apiFetch<any>('/swaps', {
    method: 'POST',
    body: JSON.stringify({ postId, title, startDate, dueDate }),
  });
}

export async function updateExchangeStatus(exchangeId: string, status: string) {
  return apiFetch<any>(`/swaps/${exchangeId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchMyLoans() {
  return apiFetch<any>(`/swaps/my-swaps`);
}
