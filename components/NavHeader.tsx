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
      <div className="flex items-center">
        <img
          src="/logo.jpg"
          alt="ourtinerary logo"
          style={{ maxHeight: "2.5rem", width: "auto" }}
        />
        <Link href="/" className="text-3xl font-bold">
          OURTINERARY
        </Link>
      </div>

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
