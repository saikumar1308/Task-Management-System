'use client'
import withAuth from "@/components/protectedRoute";
import DashboardComp from "@/components/dashboardComp";
import CreateTask from "@/components/createTask";
import { useState } from "react";
import { useEffect } from "react";
import { getToken } from "@/utils/auth";
import { User } from "next-auth";
import { TaskProvider } from "@/context/TaskContext";

function Dashboard() {
  const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const token = getToken();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
                method: 'GET',
                headers: {
                    'Authorization': token || '',
                },
            });
            const data = await res.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

  return (
    <TaskProvider>
      <div className="p-4">
        <h1 className="text-xl font-bold">Welcome to your Dashboard</h1>
        <CreateTask users={users} />
        <DashboardComp users={users} />
      </div>
    </TaskProvider>
  );
}

export default withAuth(Dashboard);
