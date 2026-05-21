import dynamic from "next/dynamic";

const DashboardContent = dynamic(() => import("./dashboard-content"));

export default function DashboardPage() {
  return <DashboardContent />;
}
