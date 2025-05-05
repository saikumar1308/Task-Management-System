"use client"
import Image from "next/image";
import Navbar from "@/components/navBar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
// import taskManagement from "@/public/task-management.png";


export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen mx-25">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col  justify-center w-150">
          <h2 className="text-6xl font-bold m-2">Task Manager</h2>
          <p className="text-lg mb-10">Join many who simplify work and life with the world’s #1 Task Manager app. Stay on top of tasks with us.</p>
          <button className="bg-blue-800 w-50 text-white px-10 py-5 rounded-2xl shadow-xl shadow-blue-800/50 cursor-pointer" onClick={() => router.push('/dashboard')}>Get Started</button>
        </div>
        <div className="flex flex-col items-center justify-center w-150 ">
          <img src="/task-management-pic.png" alt="image" className="rounded-2xl" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
