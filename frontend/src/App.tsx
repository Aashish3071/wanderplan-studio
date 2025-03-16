import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import PlanTrip from "./pages/PlanTrip";
import ItineraryDetail from "./pages/ItineraryDetail";
import LocalInsights from "./pages/LocalInsights";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import BudgetPlanner from "./pages/BudgetPlanner";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import ItineraryEditor from "./pages/ItineraryEditor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TripDetails from "./pages/TripDetails";
import EditTrip from "./pages/EditTrip";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { TripProvider } from "./contexts/TripContext";
import { ItineraryProvider } from "./contexts/ItineraryContext";
import { RecommendationProvider } from "./contexts/RecommendationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TripProvider>
        <ItineraryProvider>
          <RecommendationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/community"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Community />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plan-trip"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <PlanTrip />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/budget-planner"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <BudgetPlanner />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/itinerary-planner"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ItineraryPlanner />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/itinerary/edit/:id"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ItineraryEditor />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/itinerary/create"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ItineraryEditor />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/itinerary/:id"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ItineraryDetail />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/local-insights"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <LocalInsights />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/budget"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Budget />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Profile />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/trip/:id"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <TripDetails />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-trip/:id"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <EditTrip />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </RecommendationProvider>
        </ItineraryProvider>
      </TripProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
