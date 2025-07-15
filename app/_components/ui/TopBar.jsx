import { MenuIcon } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="Topbar">
      <div className="w-full itms-center justify-between h-16">
        <div>
          <MenuIcon />
        </div>
        <div>Admin</div>
      </div>
    </div>
  );
}
