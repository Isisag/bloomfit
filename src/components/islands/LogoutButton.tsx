import { logout } from '@/lib/auth';

export default function LogoutButton() {
  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-rose-300 hover:text-rose-400 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
