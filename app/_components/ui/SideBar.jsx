import { UserCog2 } from "lucide-react";
import Link from "next/link";

export default function SideBar() {
  return (
    <div className="flex bg-green-800">
      <div>
        <UserCog2 />
        <h1> Admin Dashboard</h1>
      </div>
      <ul>
        <li>
          <Link href="/admin/orders">Orders</Link>
        </li>
        <li>
          <Link href="/admin/products">Products</Link>
        </li>
        <li>
          <Link href="/admin/setting">Setting</Link>
        </li>
        <li>
          <Link href="/admin/users">Users</Link>
        </li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
