"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { FileText, Users, TrendingUp } from "lucide-react";
import useUser from "@/utils/useUser";

export default function Dashboard() {
  const { data: user, loading: userLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalReports: 0,
    recentReports: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
    }
  }, [user, userLoading]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (userLoading || !user) {
    return null;
  }

  const navigateToReports = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/reports/new";
    }
  };

  const navigateToReport = (id) => {
    if (typeof window !== "undefined") {
      window.location.href = `/reports/${id}`;
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} title="Dashboard" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-2 font-sora">
              Welcome back!
            </h2>
            <p className="text-[#6F6F6F] dark:text-[#AAAAAA] font-inter">
              Here's what's happening with your reports today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Clients */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 className="font-semibold text-[#4D4D4D] dark:text-[#B0B0B0] font-inter">
                  Total Clients
                </h3>
              </div>
              <p className="text-4xl font-bold text-black dark:text-white font-sora">
                {loading ? "..." : stats.totalClients}
              </p>
            </div>

            {/* Total Reports */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <FileText
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="font-semibold text-[#4D4D4D] dark:text-[#B0B0B0] font-inter">
                  Total Reports
                </h3>
              </div>
              <p className="text-4xl font-bold text-black dark:text-white font-sora">
                {loading ? "..." : stats.totalReports}
              </p>
            </div>

            {/* Quick Action */}
            <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] border border-[#2563EB] dark:border-[#1D4ED8] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-white font-inter">
                  Quick Start
                </h3>
              </div>
              <button
                onClick={navigateToReports}
                className="w-full mt-2 h-10 rounded-lg bg-white text-blue-600 font-semibold transition-all duration-150 hover:bg-blue-50 active:scale-95 font-inter"
              >
                Create Report
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 font-sora">
              Recent Reports
            </h3>

            {loading ? (
              <p className="text-[#6F6F6F] dark:text-[#AAAAAA] font-inter">
                Loading...
              </p>
            ) : stats.recentReports.length === 0 ? (
              <div className="text-center py-12">
                <FileText
                  size={48}
                  className="mx-auto mb-4 text-[#D0D0D0] dark:text-[#404040]"
                />
                <p className="text-[#6F6F6F] dark:text-[#AAAAAA] mb-4 font-inter">
                  No reports yet
                </p>
                <button
                  onClick={navigateToReports}
                  className="h-10 px-6 rounded-lg bg-gradient-to-b from-[#252525] to-[#0F0F0F] dark:from-[#FFFFFF] dark:to-[#E0E0E0] text-white dark:text-black font-semibold transition-all duration-150 hover:from-[#2d2d2d] hover:to-[#171717] active:scale-95 font-inter"
                >
                  Create your first report
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-[#E6E6E6] dark:border-[#333333] rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#262626] transition-all duration-150 cursor-pointer"
                    onClick={() => navigateToReport(report.id)}
                  >
                    <div>
                      <h4 className="font-semibold text-black dark:text-white font-inter">
                        {report.title}
                      </h4>
                      <p className="text-sm text-[#6F6F6F] dark:text-[#AAAAAA] font-inter">
                        {report.client_name} •{" "}
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <FileText
                      size={20}
                      className="text-[#6F6F6F] dark:text-[#AAAAAA]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
