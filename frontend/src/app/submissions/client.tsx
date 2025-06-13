"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  name: string;
}

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push("/");
      }
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="relative min-h-screen font-serif bg-gradient-to-br from-indigo-400 to-purple-600">
      <div className="nature-decorations pointer-events-none fixed inset-0 overflow-hidden z-0">
        {["🍃", "🌿", "🍀", "🌱"].map((leaf, i) => (
          <div
            key={`leaf-${i}`}
            className="floating-element absolute opacity-20 animate-float"
            style={{
              left: `${[5, 15, 85, 70][i]}%`,
              animationDelay: `${[0, 7, 14, 3][i]}s`,
              fontSize: `${[1.5, 1.2, 1.8, 1.3][i]}rem`,
            }}
          >
            {leaf}
          </div>
        ))}
      </div>

      <header className="relative z-10 backdrop-blur-md bg-white bg-opacity-95 shadow-md px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-col md:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center animate-pulse">
              <span>🌿</span>
            </div>
            <h1 className="text-xl font-bold text-green-900">TechiePedia</h1>
          </div>
          <div className="flex items-center gap-4 text-green-900">
            <span>Welcome, {user.name}!</span>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/");
              }}
              className="bg-gradient-to-br from-red-500 to-red-400 text-white font-bold px-4 py-2 rounded-md hover:translate-y-[-2px] hover:shadow-md transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 z-1 relative mt-8">
        <section className="welcome-card bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-white border-opacity-20 mb-8 animate-slideIn">
          <h2 className="text-2xl text-green-900 mb-4 flex items-center gap-2">
            🌟 Dashboard
          </h2>
          <p className="text-green-700 text-lg leading-relaxed">
            Welcome to your personal space in TechiePedia! Here you can manage
            your profile, view your submissions, and explore the intersection of
            technology and nature.
          </p>

          <div className="user-details grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="detail-card bg-gradient-to-br from-gray-100 to-green-100 p-6 rounded-xl border-l-4 border-green-500 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="text-green-800 text-sm font-bold uppercase tracking-wide mb-1">
                👤 Username
              </div>
              <div className="text-green-900 text-lg font-medium">
                {user.username}
              </div>
            </div>
            <div className="detail-card bg-gradient-to-br from-gray-100 to-green-100 p-6 rounded-xl border-l-4 border-green-500 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="text-green-800 text-sm font-bold uppercase tracking-wide mb-1">
                📧 Email Address
              </div>
              <div className="text-green-900 text-lg font-medium">
                {user.email}
              </div>
            </div>
            <div className="detail-card bg-gradient-to-br from-gray-100 to-green-100 p-6 rounded-xl border-l-4 border-green-500 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="text-green-800 text-sm font-bold uppercase tracking-wide mb-1">
                🌿 Full Name
              </div>
              <div className="text-green-900 text-lg font-medium">
                {user.name}
              </div>
            </div>
          </div>
        </section>

        <section className="actions-section bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-white border-opacity-20 animate-slideIn">
          <h2 className="text-xl text-green-900 mb-6 flex items-center gap-2">
            🚀 Quick Actions
          </h2>
          <div className="action-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[
              {
                icon: "📝",
                title: "New Submission",
                description:
                  "Create and submit your latest tech project or nature-inspired innovation",
              },
              {
                icon: "📊",
                title: "My Analytics",
                description:
                  "View detailed insights about your submissions and community engagement",
              },
              {
                icon: "🌍",
                title: "Explore Community",
                description:
                  "Discover amazing projects from other members of the TechiePedia community",
              },
              {
                icon: "⚙️",
                title: "Account Settings",
                description:
                  "Update your profile, preferences, and notification settings",
              },
            ].map((action, i) => (
              <div
                key={`action-${i}`}
                className="action-card bg-gradient-to-br from-white to-green-50 p-8 rounded-xl text-center transition-all border-2 border-transparent cursor-pointer hover:border-green-500 hover:-translate-y-1 hover:shadow-lg"
                onClick={() => alert(`${action.title} feature coming soon!`)}
              >
                <span className="action-icon text-4xl block mb-2">
                  {action.icon}
                </span>
                <div className="action-title text-green-900 text-lg font-bold mb-1">
                  {action.title}
                </div>
                <div className="action-description text-green-700 leading-relaxed">
                  {action.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }
        .animate-float { animation: float 20s linear infinite; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}