import { Button } from "@/components/ui/button";
import Link from "next/link";

function BackButton({ label, href }) {
  return (
    <div>
      <Button variant="link" className="font-normal w-full" size="sm" asChild>
        <Link href={href}>{label} </Link>
      </Button>
    </div>
  );
}

export default BackButton;
