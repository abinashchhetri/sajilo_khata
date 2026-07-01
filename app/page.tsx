// ─────────────────────────────────────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────────────────────────────────────
// Root route — immediately redirects to /login. The login page handles the
// "already authenticated → /dashboard" case, so there is no auth check here.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/login");
};

export default HomePage;
