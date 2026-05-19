import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="books" element={<BookPage />} />
          <Route path="authors" element={<AuthorPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="borrow-records" element={<BorrowRecordPage />} />
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
