import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";
import { MapPin, MessageSquare, Heart, AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full border-b border-b-foreground/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <MapPin className="h-6 w-6" />
            Street Fix
          </Link>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Building Better Communities
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Report issues, share resources, and connect with neighbors in
              Blantyre's informal settlements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 border rounded-lg space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto" />
              <h3 className="font-semibold text-lg">Report Issues</h3>
              <p className="text-sm text-muted-foreground">
                Document broken water points, sanitation problems, and waste issues
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <MapPin className="h-8 w-8 mx-auto" />
              <h3 className="font-semibold text-lg">Community Map</h3>
              <p className="text-sm text-muted-foreground">
                Find nearby taps, clinics, and waste collection points
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <Heart className="h-8 w-8 mx-auto" />
              <h3 className="font-semibold text-lg">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Share tips, thank neighbors, and build community
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Street Fix - Empowering communities in Blantyre 🇲🇼</p>
        </div>
      </footer>
    </main>
  );
}
