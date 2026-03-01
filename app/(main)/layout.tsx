import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MapPin, AlertCircle, Map, MessageSquare, Heart, LayoutDashboard } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { unstable_noStore as noStore } from 'next/cache';

const getUser = cache(async () => {
  noStore();
  const supabase = await createClient();
  return await supabase.auth.getUser();
});

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="h-6 w-6" />
            Street Fix
          </Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r overflow-y-auto">
          <nav className="p-4 space-y-2">
            <Link
              href="/issues"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Report Issue</span>
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Map className="h-5 w-5" />
              <span>Community Map</span>
            </Link>
            <Link
              href="/forum"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Forum</span>
            </Link>
            <Link
              href="/shoutouts"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span>Shoutouts</span>
            </Link>
            <div className="pt-4 border-t mt-4">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden border-t bg-background sticky bottom-0 flex-shrink-0">
        <div className="flex justify-around items-center p-2">
          <Link href="/issues" className="flex flex-col items-center gap-1 p-2">
            <AlertCircle className="h-5 w-5" />
            <span className="text-xs">Issues</span>
          </Link>
          <Link href="/map" className="flex flex-col items-center gap-1 p-2">
            <Map className="h-5 w-5" />
            <span className="text-xs">Map</span>
          </Link>
          <Link href="/forum" className="flex flex-col items-center gap-1 p-2">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Forum</span>
          </Link>
          <Link href="/shoutouts" className="flex flex-col items-center gap-1 p-2">
            <Heart className="h-5 w-5" />
            <span className="text-xs">Shoutouts</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
