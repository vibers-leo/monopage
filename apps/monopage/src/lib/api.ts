const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

// ---------- token ----------
export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('monopage_token') : null;

export const setToken = (token: string) =>
  localStorage.setItem('monopage_token', token);

export const clearToken = () =>
  localStorage.removeItem('monopage_token');

// ---------- fetch wrapper ----------
export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const msg = err.message || err.error || (Array.isArray(err.errors) ? err.errors.join(', ') : null) || '요청 실패';
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---------- auth ----------
export const signup = (email: string, password: string, username: string) =>
  request<{ token: string; user: any; profile: any }>('/api/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });

export const login = (email: string, password: string) =>
  request<{ token: string; user: any; profile: any }>('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// ---------- profile ----------
export const getMyProfile = () =>
  request<any>('/api/v1/profile');

export const updateProfile = (data: { bio?: string; avatar_url?: string; username?: string; theme_config?: any }) =>
  request<any>('/api/v1/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const getPublicProfile = (username: string) =>
  request<any>(`/api/v1/profiles/${username}`);

// ---------- links ----------
export const getLinks = () =>
  request<any[]>('/api/v1/links');

export const createLink = (title: string, url: string, favicon?: string, domain?: string) =>
  request<any>('/api/v1/links', {
    method: 'POST',
    body: JSON.stringify({ title, url, favicon, domain }),
  });

export const updateLink = (id: number, data: { title?: string; url?: string; favicon?: string; domain?: string }) =>
  request<any>(`/api/v1/links/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteLink = (id: number) =>
  request<void>(`/api/v1/links/${id}`, { method: 'DELETE' });

export const reorderLinks = (ids: number[]) =>
  request<any[]>('/api/v1/links/reorder', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });

// ---------- account ----------
export const changePassword = (currentPassword: string, newPassword: string) =>
  request<{ message: string }>('/api/v1/profile/password', {
    method: 'PUT',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });

export const deleteAccount = () =>
  request<{ message: string }>('/api/v1/profile', { method: 'DELETE' });

export const getSocialConnections = () =>
  request<{ provider: string | null; uid: string | null; has_password: boolean; email: string | null }>('/api/v1/auth/connections');

export const disconnectSocial = () =>
  request<{ message: string }>('/api/v1/auth/connections', { method: 'DELETE' });

// ---------- portfolio ----------
export const getPortfolioItems = () =>
  request<any[]>('/api/v1/portfolio_items');

export const createPortfolioItem = (data: { image_url: string; title?: string; description?: string; category?: string }) =>
  request<any>('/api/v1/portfolio_items', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updatePortfolioItem = (id: number, data: { title?: string; description?: string; category?: string; position?: number }) =>
  request<any>(`/api/v1/portfolio_items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deletePortfolioItem = (id: number) =>
  request<void>(`/api/v1/portfolio_items/${id}`, { method: 'DELETE' });

export const reorderPortfolioItems = (ids: number[]) =>
  request<any[]>('/api/v1/portfolio_items/reorder', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });

// ---------- social accounts (SNS 피드용) ----------
export const getSocialAccounts = () =>
  request<{ id: number; provider: string; uid: string; metadata: any }[]>('/api/v1/social_accounts');

export const deleteSocialAccount = (id: number) =>
  request<void>(`/api/v1/social_accounts/${id}`, { method: 'DELETE' });

// ---------- analytics ----------
export const getAnalytics = () =>
  request<{
    total_views: number;
    today_views: number;
    total_clicks: number;
    daily: Record<string, number>;
    link_clicks: { link_id: number; clicks: number; title: string }[];
  }>('/api/v1/analytics');

export const trackView = (profileId: number) =>
  request<void>('/api/v1/analytics/view', {
    method: 'POST',
    body: JSON.stringify({ profile_id: profileId }),
  });

// ---------- inquiries ----------
export const getInquiries = (status?: string) =>
  request<any[]>(`/api/v1/inquiries${status ? `?status=${status}` : ''}`);

export const getInquiryStats = () =>
  request<{ total: number; received: number; today: number }>('/api/v1/inquiries/stats');

export const updateInquiry = (id: number, data: { status?: string; admin_note?: string }) =>
  request<any>(`/api/v1/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteInquiry = (id: number) =>
  request<void>(`/api/v1/inquiries/${id}`, { method: 'DELETE' });

export const createInquiry = (data: { profile_id?: number; username?: string; name: string; email?: string; phone?: string; message: string }) =>
  request<any>('/api/v1/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const trackClick = (profileId: number, linkId: number) =>
  request<void>('/api/v1/analytics/click', {
    method: 'POST',
    body: JSON.stringify({ profile_id: profileId, link_id: linkId }),
  });
