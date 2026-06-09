import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import AuthorPage from '../features/authors/pages/AuthorPage';
import BookPage from '../features/books/pages/BookPage';
import BorrowRecordPage from '../features/borrow-records/pages/BorrowRecordPage';
import CategoryPage from '../features/categories/pages/CategoryPage';
import UserPage from '../features/users/pages/UserPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="books" element={<BookPage />} />
            <Route
              path="authors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                  <AuthorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="categories"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="borrow-records"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                  <BorrowRecordPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
