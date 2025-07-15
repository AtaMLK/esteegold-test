import SideBar from "../_components/ui/SideBar";
import TopBar from "../_components/ui/TopBar";

function AdminPage() {
  return (
    <div className="gridw-full h-full">
      <div className="col-span-3">
        <TopBar />
      </div>
      <div className="col-span-9">
        <SideBar />
      </div>
    </div>
  );
}

export default AdminPage;
