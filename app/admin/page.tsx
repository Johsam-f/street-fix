import { cache, Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminStats } from "./_components/admin-stats";
import { AdminIssueList } from "./_components/admin-issue-list";
import { AdminResourceForm } from "./_components/admin-resource-form";
import { AdminResourceList } from "./_components/admin-resource-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const getUser = cache(async () => {
  const supabase = await createClient();
  return await supabase.auth.getUser();
});

const checkAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin || false;
});

export default async function AdminPage() {
  const {
    data: { user },
  } = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <Link href="/issues">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Issues
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage issues, resources, and community content
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 h-40 animate-pulse bg-muted/10" />
              ))}
            </div>
          }
        >
          <AdminStats />
        </Suspense>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Issues</h2>
            <Suspense
              fallback={
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  <p>Loading issues...</p>
                </div>
              }
            >
              <AdminIssueList />
            </Suspense>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Add Resource</h2>
              <AdminResourceForm />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Manage Resources</h2>
              <Suspense
                fallback={
                  <div className="border rounded-lg p-8 text-center text-muted-foreground">
                    <p>Loading resources...</p>
                  </div>
                }
              >
                <AdminResourceList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
