import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AUTH_ME_URL } from "./services/apiConfig";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import CasesPage from "../src/components/pages/CasesPage";
import CaseDetailPage from "../src/components/pages/CaseDetailPage";
import CourtsPage from "../src/components/pages/CourtsPage";
import CourtDetailPage from "../src/components/pages/CourtDetailPage";
import JudgesPage from "../src/components/pages/JudgesPage";
import JudgeDetailPage from "../src/components/pages/JudgeDetailPage";
import LandingPage from "./components/pages/LandingPage";
import ResearchPage from "./components/pages/ResearchPage";
import ContactPage from "./components/pages/ContactPage";
import LoginPage from "./components/pages/LoginPage";
import DashboardPage from "./components/pages/DashboardPage";
import CrudPlaceholderPage from "./components/pages/CrudPlaceholderPage";
import DashboardJudgesList from "./components/pages/DashboardJudgesList";
import DashboardJudgeDetail from "./components/pages/DashboardJudgeDetail";
import DashboardJudgeCreate from "./components/pages/DashboardJudgeCreate";
import DashboardJudgeEdit from "./components/pages/DashboardJudgeEdit";
import DashboardCasesList from "./components/pages/DashboardCasesList";
import DashboardCaseDetail from "./components/pages/DashboardCaseDetail";
import DashboardCaseCreate from "./components/pages/DashboardCaseCreate";
import DashboardCaseEdit from "./components/pages/DashboardCaseEdit";
import DashboardCourtsList from "./components/pages/DashboardCourtsList";
import DashboardCourtDetail from "./components/pages/DashboardCourtDetail";
import DashboardCourtCreate from "./components/pages/DashboardCourtCreate";
import DashboardCourtEdit from "./components/pages/DashboardCourtEdit";
import DashboardUsersList from "./components/pages/DashboardUsersList";
import DashboardUserDetail from "./components/pages/DashboardUserDetail";
import DashboardUserCreate from "./components/pages/DashboardUserCreate";
import DashboardUserEdit from "./components/pages/DashboardUserEdit";

const AUTH_STATE_KEY = "hc_auth_state";

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div id="app" className={isLanding ? "landing-theme" : "light-theme"}>
      {!isDashboard && <Header />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/data/courts" element={<CourtsPage />} />
        <Route path="/data/courts/:courtId" element={<CourtDetailPage />} />
        <Route
          path="/data/courts/new"
          element={
            <CrudPlaceholderPage
              title="Create a new court"
              description="Set up court details, jurisdiction metadata, and reporting rules."
              backTo="/dashboard"
              backLabel="Back to dashboard"
            />
          }
        />
        <Route path="/data/cases" element={<CasesPage />} />
        <Route path="/data/cases/:caseId" element={<CaseDetailPage />} />
        <Route
          path="/data/cases/new"
          element={
            <CrudPlaceholderPage
              title="Create a new case"
              description="Capture filings, parties, evidence, and tracking milestones."
              backTo="/dashboard"
              backLabel="Back to dashboard"
            />
          }
        />
        <Route path="/data/judges" element={<JudgesPage />} />
        <Route path="/data/judges/:judgeId" element={<JudgeDetailPage />} />
        <Route
          path="/data/judges/new"
          element={
            <CrudPlaceholderPage
              title="Create a new judge"
              description="Document profiles, assignments, and review signals."
              backTo="/dashboard"
              backLabel="Back to dashboard"
            />
          }
        />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="courts" element={<DashboardCourtsList />} />
          <Route path="courts/new" element={<DashboardCourtCreate />} />
          <Route path="courts/:id" element={<DashboardCourtDetail />} />
          <Route path="courts/:id/edit" element={<DashboardCourtEdit />} />
          <Route path="cases" element={<DashboardCasesList />} />
          <Route path="cases/new" element={<DashboardCaseCreate />} />
          <Route path="cases/:id" element={<DashboardCaseDetail />} />
          <Route path="cases/:id/edit" element={<DashboardCaseEdit />} />
          <Route path="judges" element={<DashboardJudgesList />} />
          <Route path="judges/new" element={<DashboardJudgeCreate />} />
          <Route path="judges/:id" element={<DashboardJudgeDetail />} />
          <Route path="judges/:id/edit" element={<DashboardJudgeEdit />} />
          <Route path="users" element={<DashboardUsersList />} />
          <Route path="users/new" element={<DashboardUserCreate />} />
          <Route path="users/:id" element={<DashboardUserDetail />} />
          <Route path="users/:id/edit" element={<DashboardUserEdit />} />
        </Route>

        
      </Routes>

      {!isDashboard && <Footer />}
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const storedState =
    typeof window === "undefined" ? null : window.localStorage.getItem(AUTH_STATE_KEY);
  const [status, setStatus] = useState<"checking" | "authed" | "guest">(
    storedState === "admin" ? "authed" : storedState === "logged_out" ? "guest" : "checking"
  );

  useEffect(() => {
    let mounted = true;
    fetch(AUTH_ME_URL, { credentials: "include" })
      .then((r) => r.json().catch(() => null))
      .then((data) => {
        if (!mounted) return;
        const role = String(data?.user?.role ?? data?.role ?? "").trim().toLowerCase();
        const hasRole = role.length > 0;
        if (storedState === "logged_out") {
          setStatus("guest");
          return;
        }
        if (data && data.ok === true) {
          if (!hasRole || role === "admin") setStatus("authed");
          else setStatus("guest");
        } else {
          if (storedState === "admin") setStatus("authed");
          else setStatus("guest");
        }
      })
      .catch(() => {
        if (!mounted) return;
        if (storedState === "admin") setStatus("authed");
        else setStatus("guest");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") return null;
  if (status === "guest") return <Navigate to="/login" replace />;
  return children;
}
