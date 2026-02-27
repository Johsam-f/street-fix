import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // TODO: Check if user is admin (check profiles table)
  // For now, show the admin UI to all authenticated users

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage issues, resources, and community content
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Total Issues</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-2">
            Open: 0 | Resolved: 0
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Resources</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-2">
            Taps, clinics, waste points
          </p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-2">Forum Posts</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-2">
            Community discussions
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        <p>Admin tools will go here</p>
        <p className="text-sm mt-2">
          Features: Update issue status, add resources, moderate content
        </p>
      </div>
    </div>
  );
}
