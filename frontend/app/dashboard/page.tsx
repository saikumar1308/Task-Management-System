'use client'
import withAuth from "@/components/protectedRoute";
import DashboardComp from "@/components/dashboardComp";
import CreateTask from "@/components/createTask";
function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <CreateTask />
      <DashboardComp />
    </div>
  );
}

export default withAuth(Dashboard);
