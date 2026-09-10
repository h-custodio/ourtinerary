import createClient from "@/lib/supabase/server";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";

const NavHeader = async () => {
  const supabaseServer = await createClient();

  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  return (
    <div className="flex justify-between">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/logo.jpg"
          alt="ourtinerary logo"
          className="max-h-10 w-auto"
        />
        <p className="text-3xl font-bold">OURTINERARY</p>
      </Link>

      <nav>
        {!user ? (
          <Link
            href="/auth/login"
            className={buttonVariants({ size: "lg", variant: "default" })}
          >
            Sign in
          </Link>
        ) : (
          <div className="flex gap-1">
            <Link
              href="/account"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              Account
            </Link>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavHeader;
