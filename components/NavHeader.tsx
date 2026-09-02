import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const NavHeader = () => {
  return (
    <header className="nav-header">
      <div className="flex justify-between">
        <Link href="/" className="text-2xl font-bold">
          outinerary
        </Link>

        <nav className="flex gap-1">
          <Link
            href="/"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Plans
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg", variant: "secondary" })}
          >
            Account
          </Link>
          <Link
            href="/auth/login"
            className={buttonVariants({ size: "lg", variant: "default" })}
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavHeader;
