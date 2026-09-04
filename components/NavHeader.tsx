import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";

const NavHeader = () => {
  // verify that user is authenticated
  //   const {
  //     data: { user },
  //     error,
  //   } = await supabase.auth.getUser();

  //   if (error) {
  //     console.error("Failed to get user:", error);
  //     return;
  //   }

  const user = "";

  return (
    <header className="nav-header">
      <div className="flex justify-between">
        <Link href="/" className="text-3xl font-bold">
          ourtinerary
        </Link>

        <nav className="flex gap-1">
          {user !== null && (
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
          {user === null && (
            <Link
              href="/auth/login"
              className={buttonVariants({ size: "lg", variant: "default" })}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavHeader;
