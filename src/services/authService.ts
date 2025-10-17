import type { User } from '../types';

const USERS_KEY = 'property_scout_users';
const CURRENT_USER_KEY = 'property_scout_current_user';

class AuthService {
  private getUsers(): Record<string, string> {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  }

  private saveUsers(users: Record<string, string>): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async signup(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        if (users[email]) {
          return reject(new Error('An account with this email already exists.'));
        }
        // In a real app, hash the password!
        users[email] = password;
        this.saveUsers(users);
        const newUser: User = { email };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 500);
    });
  }

  async login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers();
        if (!users[email] || users[email] !== password) {
          return reject(new Error('Invalid email or password.'));
        }
        const user: User = { email };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();