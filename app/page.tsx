// app/page.tsx
"use server";
import { auth0 } from "@/lib/auth0";
import './globals.css';
import ClientHome from './ClientHome';
import jwt from 'jsonwebtoken';

export default async function Home() {
  const session = await auth0.getSession();
  console.log('User session:', JSON.stringify(session, null, 2));
  const isLoggedIn = !!session;
  const userName = session?.user?.name || session?.user?.email || '';
  let roles: string[] = [];
  let isAdmin = false;

  if (isLoggedIn && session?.user) {
    try {
      // Try to get roles from user object (custom claim)
      roles = session.user['https://your-app.com/roles'] || [];
      // If not found, try to decode the ID token
      if ((!roles || roles.length === 0) && session?.tokenSet?.idToken) {
        const decoded = jwt.decode(session.tokenSet.idToken);
        if (decoded && typeof decoded === 'object' && decoded['https://your-app.com/roles']) {
          roles = decoded['https://your-app.com/roles'];
        }
      }
      isAdmin = roles.some(role => role.toLowerCase() === 'admin');
      console.log('User roles:', roles);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      roles = [];
      isAdmin = false;
    }
  }

  return (
    <ClientHome 
      isLoggedIn={isLoggedIn} 
      userName={userName} 
      isAdmin={isAdmin}
      userRoles={roles}
    />
  );
}