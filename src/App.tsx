import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Layout } from '@/components/common/Layout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { AdminRoute } from '@/components/common/AdminRoute'
import { GuestRoute } from '@/components/common/GuestRoute'

// Pages — lazy-loaded for code splitting
import { LandingPage } from '@/pages/Landing'
const CropHomePage = lazy(() =>
    import('@/pages/CropHome').then((m) => ({ default: m.CropHomePage })),
)
const LoginPage = lazy(() =>
    import('@/pages/Login').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
    import('@/pages/Register').then((m) => ({ default: m.RegisterPage })),
)
const AuthCallbackPage = lazy(() =>
    import('@/pages/AuthCallback').then((m) => ({
        default: m.AuthCallbackPage,
    })),
)
const DiseaseListPage = lazy(() =>
    import('@/pages/DiseaseList').then((m) => ({ default: m.DiseaseListPage })),
)
const DiseaseDetailPage = lazy(() =>
    import('@/pages/DiseaseDetail').then((m) => ({
        default: m.DiseaseDetailPage,
    })),
)
const CropDetailPage = lazy(() =>
    import('@/pages/CropDetail').then((m) => ({ default: m.CropDetailPage })),
)
const MyPreparationsPage = lazy(() =>
    import('@/pages/MyPreparations').then((m) => ({
        default: m.MyPreparationsPage,
    })),
)
const SettingsPage = lazy(() =>
    import('@/pages/Settings').then((m) => ({ default: m.SettingsPage })),
)
const SoilRecommenderPage = lazy(() =>
    import('@/pages/SoilRecommender').then((m) => ({
        default: m.SoilRecommenderPage,
    })),
)
const ScannerPage = lazy(() =>
    import('@/pages/Scanner').then((m) => ({ default: m.ScannerPage })),
)
const ChatPage = lazy(() =>
    import('@/pages/Chat').then((m) => ({ default: m.ChatPage })),
)

// Admin Pages (lazy-loaded)
const AdminDashboardPage = lazy(() =>
    import('@/pages/admin/AdminDashboard').then((m) => ({
        default: m.AdminDashboardPage,
    })),
)
const AdminDiseaseListPage = lazy(() =>
    import('@/pages/admin/AdminDiseaseList').then((m) => ({
        default: m.AdminDiseaseListPage,
    })),
)
const AdminDiseaseFormPage = lazy(() =>
    import('@/pages/admin/AdminDiseaseForm').then((m) => ({
        default: m.AdminDiseaseFormPage,
    })),
)
const AdminRemedyListPage = lazy(() =>
    import('@/pages/admin/AdminRemedyList').then((m) => ({
        default: m.AdminRemedyListPage,
    })),
)
const AdminRemedyFormPage = lazy(() =>
    import('@/pages/admin/AdminRemedyForm').then((m) => ({
        default: m.AdminRemedyFormPage,
    })),
)
const AdminCropListPage = lazy(() =>
    import('@/pages/admin/AdminCropList').then((m) => ({
        default: m.AdminCropListPage,
    })),
)
const AdminCropFormPage = lazy(() =>
    import('@/pages/admin/AdminCropForm').then((m) => ({
        default: m.AdminCropFormPage,
    })),
)
const AdminCropVarietyListPage = lazy(() =>
    import('@/pages/admin/AdminCropVarietyList').then((m) => ({
        default: m.AdminCropVarietyListPage,
    })),
)
const AdminCropVarietyFormPage = lazy(() =>
    import('@/pages/admin/AdminCropVarietyForm').then((m) => ({
        default: m.AdminCropVarietyFormPage,
    })),
)
const AdminVarietyListPage = lazy(() =>
    import('@/pages/admin/AdminVarietyList').then((m) => ({
        default: m.AdminVarietyListPage,
    })),
)

import { DEFAULT_STALE_TIME, DEFAULT_QUERY_RETRY } from '@/config/env'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: DEFAULT_STALE_TIME, retry: DEFAULT_QUERY_RETRY },
    },
})

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            {/* Public pages */}
                            <Route path="/" element={<LandingPage />} />
                            <Route
                                path="/crops"
                                element={
                                    <Suspense>
                                        <CropHomePage />
                                    </Suspense>
                                }
                            />
                            {/* Guest-only: redirect logged-in users */}
                            <Route element={<GuestRoute />}>
                                <Route
                                    path="/login"
                                    element={
                                        <Suspense>
                                            <LoginPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/register"
                                    element={
                                        <Suspense>
                                            <RegisterPage />
                                        </Suspense>
                                    }
                                />
                            </Route>
                            <Route
                                path="/auth/callback"
                                element={
                                    <Suspense>
                                        <AuthCallbackPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/crops/:id"
                                element={
                                    <Suspense>
                                        <CropDetailPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/diseases"
                                element={
                                    <Suspense>
                                        <DiseaseListPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/diseases/:id"
                                element={
                                    <Suspense>
                                        <DiseaseDetailPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/recommend"
                                element={
                                    <Suspense>
                                        <SoilRecommenderPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/scanner"
                                element={
                                    <Suspense>
                                        <ScannerPage />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/chat"
                                element={
                                    <Suspense>
                                        <ChatPage />
                                    </Suspense>
                                }
                            />
                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route
                                    path="/my-preparations"
                                    element={
                                        <Suspense>
                                            <MyPreparationsPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <Suspense>
                                            <SettingsPage />
                                        </Suspense>
                                    }
                                />
                            </Route>
                            {/* Admin Routes */}
                            <Route element={<AdminRoute />}>
                                <Route
                                    path="/admin"
                                    element={
                                        <Suspense>
                                            <AdminDashboardPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/diseases"
                                    element={
                                        <Suspense>
                                            <AdminDiseaseListPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/diseases/add"
                                    element={
                                        <Suspense>
                                            <AdminDiseaseFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/diseases/:id"
                                    element={
                                        <Suspense>
                                            <AdminDiseaseFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/remedies"
                                    element={
                                        <Suspense>
                                            <AdminRemedyListPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/remedies/add"
                                    element={
                                        <Suspense>
                                            <AdminRemedyFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/remedies/:id"
                                    element={
                                        <Suspense>
                                            <AdminRemedyFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/crops"
                                    element={
                                        <Suspense>
                                            <AdminCropListPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/crops/add"
                                    element={
                                        <Suspense>
                                            <AdminCropFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/crops/:id"
                                    element={
                                        <Suspense>
                                            <AdminCropFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/crops/:cropId/varieties"
                                    element={
                                        <Suspense>
                                            <AdminCropVarietyListPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/crops/:cropId/varieties/add"
                                    element={
                                        <Suspense>
                                            <AdminCropVarietyFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/crops/:cropId/varieties/:id"
                                    element={
                                        <Suspense>
                                            <AdminCropVarietyFormPage />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="/admin/varieties"
                                    element={
                                        <Suspense>
                                            <AdminVarietyListPage />
                                        </Suspense>
                                    }
                                />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
                <Analytics />
                <SpeedInsights />
            </AuthProvider>
        </QueryClientProvider>
    )
}
