import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import PublicRoute from './PublicRoute'
import PageSkeleton from '@/components/skeletons/PageSkeleton'
import AppShell from '@/components/layout/AppShell'
import { Outlet } from 'react-router-dom'

const L = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
)

const Layout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
)

// Pages
const SplashScreen          = lazy(() => import('@/pages/splash/SplashScreen'))
const OnboardingPage        = lazy(() => import('@/pages/onboarding/OnboardingPage'))
const LoginPage             = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage          = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage    = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage     = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const VerifyEmailPage       = lazy(() => import('@/pages/auth/VerifyEmailPage'))
const HomePage              = lazy(() => import('@/pages/home/HomePage'))
const SearchPage            = lazy(() => import('@/pages/search/SearchPage'))
const SavedPage             = lazy(() => import('@/pages/saved/SavedPage'))
const MessagesPage          = lazy(() => import('@/pages/messages/MessagesPage'))
const ConversationPage      = lazy(() => import('@/pages/messages/ConversationPage'))
const ProfilePage           = lazy(() => import('@/pages/profile/ProfilePage'))
const PublicProfilePage     = lazy(() => import('@/pages/profile/PublicProfilePage'))
const EditProfilePage       = lazy(() => import('@/pages/profile/EditProfilePage'))
const SettingsPage          = lazy(() => import('@/pages/profile/SettingsPage'))
const PropertyDetailPage    = lazy(() => import('@/pages/property/PropertyDetailPage'))
const AddPropertyPage       = lazy(() => import('@/pages/property/AddPropertyPage'))
const EditPropertyPage      = lazy(() => import('@/pages/property/EditPropertyPage'))
const ReservationsPage      = lazy(() => import('@/pages/reservations/ReservationsPage'))
const SellerDashboardPage   = lazy(() => import('@/pages/seller/SellerDashboardPage'))
const MyListingsPage        = lazy(() => import('@/pages/seller/MyListingsPage'))
const SellerAnalyticsPage   = lazy(() => import('@/pages/seller/SellerAnalyticsPage'))
const AdminDashboardPage    = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminUsersPage        = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminPropertiesPage   = lazy(() => import('@/pages/admin/AdminPropertiesPage'))
const AdminReportsPage      = lazy(() => import('@/pages/admin/AdminReportsPage'))
const PlatformSettingsPage  = lazy(() => import('@/pages/admin/PlatformSettingsPage'))
const NotFoundPage          = lazy(() => import('@/pages/error/NotFoundPage'))
const UnauthorizedPage      = lazy(() => import('@/pages/error/UnauthorizedPage'))
// const ErrorPage             = lazy(() => import('@/pages/error/ErrorPage'))

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public (redirect if logged in)
      { path: ROUTES.SPLASH,          element: <PublicRoute>{L(SplashScreen)}</PublicRoute> },
      { path: ROUTES.ONBOARDING,      element: <PublicRoute>{L(OnboardingPage)}</PublicRoute> },
      { path: ROUTES.LOGIN,           element: <PublicRoute>{L(LoginPage)}</PublicRoute> },
      { path: ROUTES.REGISTER,        element: <PublicRoute>{L(RegisterPage)}</PublicRoute> },
      { path: ROUTES.FORGOT_PASSWORD, element: <PublicRoute>{L(ForgotPasswordPage)}</PublicRoute> },
      { path: ROUTES.RESET_PASSWORD,  element: L(ResetPasswordPage) },
      { path: ROUTES.VERIFY_EMAIL,    element: L(VerifyEmailPage) },

      // Main app (public browsing)
      { path: ROUTES.HOME,            element: L(HomePage) },
      { path: ROUTES.SEARCH,          element: L(SearchPage) },

      // Authenticated user pages
      { path: ROUTES.SAVED,           element: <ProtectedRoute>{L(SavedPage)}</ProtectedRoute> },
      { path: ROUTES.MESSAGES,        element: <ProtectedRoute>{L(MessagesPage)}</ProtectedRoute> },
      { path: ROUTES.CONVERSATION,    element: <ProtectedRoute>{L(ConversationPage)}</ProtectedRoute> },
      { path: ROUTES.PROFILE,         element: <ProtectedRoute>{L(ProfilePage)}</ProtectedRoute> },
      { path: ROUTES.EDIT_PROFILE,    element: <ProtectedRoute>{L(EditProfilePage)}</ProtectedRoute> },
      { path: ROUTES.SETTINGS,        element: <ProtectedRoute>{L(SettingsPage)}</ProtectedRoute> },
      { path: `${ROUTES.PROFILE}/:username`,  element: L(PublicProfilePage) },
      { path: ROUTES.PROPERTY_DETAIL, element: L(PropertyDetailPage) },
      { path: ROUTES.ADD_PROPERTY,    element: <ProtectedRoute><RoleRoute roles={['seller','agent','admin','super_admin']}>{L(AddPropertyPage)}</RoleRoute></ProtectedRoute> },
      { path: `${ROUTES.EDIT_PROPERTY}/:id`,   element: <ProtectedRoute>{L(EditPropertyPage)}</ProtectedRoute> },
      { path: ROUTES.RESERVATIONS,    element: <ProtectedRoute>{L(ReservationsPage)}</ProtectedRoute> },

      // Seller
      { path: ROUTES.SELLER_DASHBOARD, element: <ProtectedRoute><RoleRoute roles={['seller','agent','admin','super_admin']}>{L(SellerDashboardPage)}</RoleRoute></ProtectedRoute> },
      { path: ROUTES.SELLER_LISTINGS,  element: <ProtectedRoute><RoleRoute roles={['seller','agent','admin','super_admin']}>{L(MyListingsPage)}</RoleRoute></ProtectedRoute> },
      { path: ROUTES.SELLER_ANALYTICS, element: <ProtectedRoute><RoleRoute roles={['seller','agent','admin','super_admin']}>{L(SellerAnalyticsPage)}</RoleRoute></ProtectedRoute> },

      // Admin
      { path: ROUTES.ADMIN,            element: <ProtectedRoute><RoleRoute roles={['admin','super_admin']}>{L(AdminDashboardPage)}</RoleRoute></ProtectedRoute> },
      { path: ROUTES.ADMIN_USERS,      element: <ProtectedRoute><RoleRoute roles={['admin','super_admin']}>{L(AdminUsersPage)}</RoleRoute></ProtectedRoute> },
      { path: ROUTES.ADMIN_PROPERTIES, element: <ProtectedRoute><RoleRoute roles={['admin','super_admin']}>{L(AdminPropertiesPage)}</RoleRoute></ProtectedRoute> },
      { path: ROUTES.ADMIN_REPORTS,    element: <ProtectedRoute><RoleRoute roles={['admin','super_admin']}>{L(AdminReportsPage)}</RoleRoute></ProtectedRoute> },
      { path: ROUTES.PLATFORM_SETTINGS, element: <ProtectedRoute><RoleRoute roles={['admin','super_admin']}>{L(PlatformSettingsPage)}</RoleRoute></ProtectedRoute> },

      // Errors
      { path: ROUTES.UNAUTHORIZED, element: L(UnauthorizedPage) },
      { path: ROUTES.NOT_FOUND,    element: L(NotFoundPage) },
      { path: '*',                 element: L(NotFoundPage) },
    ],
  },
])
