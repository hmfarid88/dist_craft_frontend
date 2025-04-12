

// solution 01

import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/auth'
import { cookies } from 'next/headers'

const adminProtectedRoutes = [''];
const userProtectedRoutes = [''];
const publicRoutes = ['/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminProtectedRoute = adminProtectedRoutes.includes(path);
  const isUserProtectedRoute = userProtectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const cookie = cookies().get('session')?.value;
  
  // Handle missing cookie
  if (!cookie) {
    if (isAdminProtectedRoute || isUserProtectedRoute) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
    return NextResponse.next();
  }

  const session = await decrypt(cookie);

  // If decryption fails or userId is missing, redirect to login for protected routes
  if (isAdminProtectedRoute || isUserProtectedRoute && !session?.username) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (session?.username) {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/user/userRole?name=${session.username}`);
      const user = await res.json();

      if (isPublicRoute) {
        if (user.roles === 'ROLE_ADMIN' && !req.nextUrl.pathname.startsWith('/admin-dashboard')) {
          return NextResponse.redirect('/admin-dashboard');
        }
        if (user.roles === 'ROLE_USER' && !req.nextUrl.pathname.startsWith('/dashboard')) {
          return NextResponse.redirect('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Handle error accordingly, maybe log it or notify admin
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


// solution 02

// import { NextRequest, NextResponse } from 'next/server';
// import { decrypt } from '@/app/lib/auth';
// import { cookies } from 'next/headers';

// // Define the roles as a union type
// type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' ;

// // Role-based protected routes mapping
// const roleRouteMap: Record<UserRole, string[]> = {
//   ROLE_ADMIN: ['/admin-dashboard', '/addadmin', '/adduser'],
//   ROLE_USER: [
//     '/adminstration',
//     '/cashbook',
//     '/dashboard',
//     '/barcode-generation',
//     '/datewise-entry-report',
//     '/datewise-expense-report',
//     '/datewise-profitreport',
//     '/datewise-salereport',
//     '/datewise-vendor-salereport',
//     '/details-payment-report',
//     '/details-supplier-report',
//     '/expense-report',
//     '/invoice',
//     '/invoice-list',
//     '/monthly-profit',
//     '/monthly-salereport',
//     '/payment',
//     '/payment-report',
//     '/pricedrop-list',
//     '/product-edit',
//     '/product-entry',
//     '/product-info',
//     '/profit-report',
//     '/profit-withdraws',
//     '/purchase',
//     '/sale',
//     '/salereport',
//     '/stock-details',
//     '/stockreport',
//     '/supplier-report',
//     '/vendor-sale',
//     '/vendor-sale-report',
      
//   ],
  
// };
// const publicRoutes = ['/'];

// export default async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   // Check if the path is public
//   const isPublicRoute = publicRoutes.includes(path);

//   // Find the roles that protect the current route
//   const protectingRoles = (Object.keys(roleRouteMap) as UserRole[]).filter((role) =>
//     roleRouteMap[role].includes(path)
//   );

//   const cookie = cookies().get('session')?.value;

//   // If no session cookie is found and the route is protected, redirect to the home page
//   if (!cookie && protectingRoles.length > 0) {
//     return NextResponse.redirect(new URL('/', req.nextUrl));
//   }

//   try {
//     const session = await decrypt(cookie);

//     // If session decryption fails or userId is missing, redirect for protected routes
//     if (!session?.username && protectingRoles.length > 0) {
//       return NextResponse.redirect(new URL('/', req.nextUrl));
//     }

//     if (session?.username && session?.roles) {
//       // Check if user role matches the role protecting the route
//       if (
//         protectingRoles.length > 0 &&
//         !protectingRoles.includes(session.roles as UserRole)
//       ) {
//         return NextResponse.redirect(new URL('/', req.nextUrl));
//       }

//       // Redirect logged-in users accessing public routes to their respective dashboards
//       if (isPublicRoute) {
//         if (
//           session.roles === 'ROLE_ADMIN' &&
//           !req.nextUrl.pathname.startsWith('/admin-dashboard')
//         ) {
//           return NextResponse.redirect(new URL('/admin-dashboard', req.nextUrl));
//         }
//         if (
//           session.roles === 'ROLE_USER' &&
//           !req.nextUrl.pathname.startsWith('/dashboard')
//         ) {
//           return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
//         }
        
//       }
//     }
//   } catch (error) {
//     console.error('Error in middleware:', error);
//     // Redirect to login page or custom error page if needed
//     return NextResponse.redirect(new URL('/', req.nextUrl));
//   }

//   // Allow request to continue if all checks are passed
//   return NextResponse.next();
// }

// export const config = {
//    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };

