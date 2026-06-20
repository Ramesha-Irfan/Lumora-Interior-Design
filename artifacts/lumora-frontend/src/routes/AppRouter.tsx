import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Spinner } from "@/components/ui/spinner";
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const HomePage = lazy(() => import("@/pages/Home"));
const StudioPage = lazy(() => import("@/pages/Studio"));
const GalleryPage = lazy(() => import("@/pages/Gallery"));
const LoginPage = lazy(() => import("@/pages/Login"));
const SignupPage = lazy(() => import("@/pages/Signup"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const Overview = lazy(() => import("@/pages/Dashboard/Overview"));
const Projects = lazy(() => import("@/pages/Dashboard/Projects"));
const History = lazy(() => import("@/pages/Dashboard/History"));
const Favorites = lazy(() => import("@/pages/Dashboard/Favorites"));
const Downloads = lazy(() => import("@/pages/Dashboard/Downloads"));
const Settings = lazy(() => import("@/pages/Dashboard/Settings"));

function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-background">
      <Spinner className="h-8 w-8 text-muted-foreground" />
    </div>
  );
}

export default function AppRouter() {
  const [location] = useLocation();
  const isDashboard = location.startsWith("/dashboard");
  const isAuth = location === "/login" || location === "/signup";

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (isAuth) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
        </Switch>
      </Suspense>
    );
  }

  if (isDashboard) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense fallback={<RouteFallback />}>
            <Switch>
              <Route path="/dashboard" component={Overview} />
              <Route path="/dashboard/projects" component={Projects} />
              <Route path="/dashboard/history" component={History} />
              <Route path="/dashboard/favorites" component={Favorites} />
              <Route path="/dashboard/downloads" component={Downloads} />
              <Route path="/dashboard/settings" component={Settings} />
              <Route component={NotFoundPage} />
            </Switch>
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <PublicLayout>
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/studio" component={StudioPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </PublicLayout>
  );
}

