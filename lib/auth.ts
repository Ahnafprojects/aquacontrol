const AUTH_KEY = 'aquacontrol_auth';

export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'pdam2024') {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username, ts: Date.now() }));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_KEY);
}
