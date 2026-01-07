"use server";

// Note: This file is now simplified to only fetching data for SSR pages.
// Write operations are handled in the Client Component directly using Firebase SDK.

// Server Actions using Firebase Admin would be ideal here for SSR data fetching,
// BUT since we don't have firebase-admin set up in package.json, 
// and using Client SDK in Server Components has limitations (no auth persistence),
// we will fetch data on the Client Side for the admin list, 
// OR use a simple fetch if we had a REST API.

// However, for the Public Portfolio Page (SEO), we ideally want SSR.
// We can use the REST API of Firestore for simple GET requests if needed, 
// or allows the Client Component to render the list.
// For now, let's keep the fallback logic here for safety, 
// but the actual Admin Page will likely need to become a Client Component to fetch Firestore data cleanly.

export type PortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  external_url: string | null;
  internal_path: string | null;
  category: string | null;
  is_active: boolean;
  created_at: any; // Firestore Timestamp or string
};

// We will return empty or fallback here.
// Real data fetching will happen in the Page components (Client Side) for now
// to avoid "Firebase Client SDK in Server Component" issues without firebase-admin.
export async function getPortfolios() {
  return []; 
}
