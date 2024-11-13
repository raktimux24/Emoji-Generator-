import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Karao.digital. All rights reserved.
          </div>
          <nav className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}