export default function AdminLayout({ children }) {
  return (
    <div>
      <dody className="w-full h-full">
        {/* <TopBar/>
        <SideBAr/> */}
        <main>{children}</main>
      </dody>
    </div>
  );
}
