import { apiFetch } from './apiClient';

export interface CreateItemPayload {
  title: string;
  category: string;
  type: 'OFFER' | 'REQUEST';
  description?: string;
  duration?: number;
  urgent?: boolean;
  distanceKm?: number;
  location?: string;
  image?: string;
  isAnonymous?: boolean;
  tags?: string[];
  [key: string]: unknown;
}

export interface BackendPostResponse {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: string;
  urgent?: boolean;
  distanceKm?: number;
  location?: string;
  image?: string;
  isAnonymous?: boolean;
  userId?: string;
  lat?: number;
  lng?: number;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    avatar?: string;
    phone?: string;
    city?: string;
    neighborhood?: string;
    trustPoints?: number;
  };
}

export async function fetchItems(userLat: number, userLon: number, radiusKm: number, category?: string) {
  const queryParams = new URLSearchParams({
    lat: userLat.toString(),
    lng: userLon.toString(),
    radius: radiusKm.toString(),
    type: 'REQUEST',
    ...(category && category !== 'all' && category !== 'الكل' && { category }),
  });

  // Call /posts instead of /api/posts
  return apiFetch<BackendPostResponse[]>(`/posts?${queryParams.toString()}`);
}

export async function insertItem(itemData: CreateItemPayload) {
  // Call /posts instead of /api/posts
  return apiFetch<BackendPostResponse>('/posts', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
}
