import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <p className="mt-2 text-slate-400">Login sebagai: {user.email}</p>
    </section>
  );
}