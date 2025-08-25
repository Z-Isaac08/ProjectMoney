import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";
import ErrorBoundary from "./components/errorboundary/ErrorBoundary";
import Layout from "./components/layout/Layout";
import { useAuthStore } from "./stores/authStore";

// Pages dynamiques
const HomePage = lazy(() => import("@pages/HomePage"));
// LIBRARY ROUTES COMMENTED OUT FOR MVP
// const LibraryPage = lazy(() => import("@pages/LibraryPage"));
// const MyBooksPage = lazy(() => import("@pages/MyBooksPage"));
const AdminDashboard = lazy(() => import("@pages/AdminDashboard"));

const AppContent = () => {
  const { initAuth, loading } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app startup
    initAuth();
  }, [initAuth]);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-normal-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-8 h-8 border-4 border-normal-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          {/* Routes avec layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          {/* LIBRARY ROUTES COMMENTED OUT FOR MVP */}
          {/* <Route path="/librairie" element={<Layout><LibraryPage /></Layout>} /> */}
          {/* <Route path="/mes-livres" element={<Layout><MyBooksPage /></Layout>} /> */}
          
          {/* Route admin sans layout */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return <AppContent />;
}

export default App;
