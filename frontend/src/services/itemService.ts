import { apiFetch } from './apiClient';

export async function fetchItems(userLat: number, userLon: number, radiusKm: number, category?: string) {
  const queryParams = new URLSearchParams({
    lat: userLat.toString(),
    lng: userLon.toString(),
    radius: radiusKm.toString(),
    type: 'REQUEST',
    ...(category && category !== 'all' && category !== 'الكل' && { category }),
  });

  // Call /posts instead of /api/posts
  return apiFetch<any[]>(`/posts?${queryParams.toString()}`);
}

export async function insertItem(itemData: any) {
  // Call /posts instead of /api/posts
  return apiFetch<any>('/posts', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
}
