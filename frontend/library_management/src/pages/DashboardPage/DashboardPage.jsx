import { useEffect, useMemo, useState } from 'react';
import * as authorApi from '../../api/authorApi';
import * as bookApi from '../../api/bookApi';
import * as borrowRecordApi from '../../api/borrowRecordApi';
import * as categoryApi from '../../api/categoryApi';
import * as userApi from '../../api/userApi';
import './DashboardPage.css';

function StatCard({ label, value, className }) {
  return (
    <div className={`stat-card ${className || ''}`}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function getSafeArray(data) {
  return Array.isArray(data) ? data : [];
}

function isForbidden(error) {
  return error?.status === 403;
}

function isAdminUser() {
  return (localStorage.getItem('role') || '').toUpperCase() === 'ADMIN';
}

function getLatestRecords(records) {
  return [...records]
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || a.borrowDate || 0).getTime();
      const bTime = new Date(b.createdAt || b.borrowDate || 0).getTime();

      if (aTime !== bTime) {
        return bTime - aTime;
      }

      return Number(b.id || 0) - Number(a.id || 0);
    })
    .slice(0, 5);
}

function getUserDisplayName(record, users) {
  const userId = record.userId ?? record.user?.id;
  const matchedUser = users.find((user) => Number(user.id) === Number(userId));

  return (
    record.user?.fullName ||
    record.user?.username ||
    matchedUser?.fullName ||
    matchedUser?.username ||
    (userId ? `Người dùng #${userId}` : 'Không rõ người mượn')
  );
}

function getBookTitle(record, books) {
  const bookId = record.bookId ?? record.book?.id;
  const matchedBook = books.find((book) => Number(book.id) === Number(bookId));

  return record.book?.title || matchedBook?.title || (bookId ? `Sách #${bookId}` : 'Không rõ sách');
}

function DashboardPage() {
  const [notes, setNotes] = useState(
    'Ghi chú quản trị: theo dõi tình trạng mượn trả, kiểm tra danh mục mới.'
  );
  const [dashboardData, setDashboardData] = useState({
    books: [],
    authors: [],
    categories: [],
    users: [],
    borrowRecords: [],
    restrictedUsers: false,
    restrictedBorrowRecords: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setError('');
      setWarning('');

      const currentUserIsAdmin = isAdminUser();
      const results = await Promise.allSettled([
        bookApi.getAll(),
        authorApi.getAll(),
        categoryApi.getAll(),
        userApi.getAll(),
        borrowRecordApi.getAll(),
      ]);

      if (!isMounted) {
        return;
      }

      const [booksResult, authorsResult, categoriesResult, usersResult, borrowRecordsResult] = results;
      const nextData = {
        books: booksResult.status === 'fulfilled' ? getSafeArray(booksResult.value) : [],
        authors: authorsResult.status === 'fulfilled' ? getSafeArray(authorsResult.value) : [],
        categories: categoriesResult.status === 'fulfilled' ? getSafeArray(categoriesResult.value) : [],
        users: [],
        borrowRecords: [],
        restrictedUsers: false,
        restrictedBorrowRecords: false,
      };
      const errors = [];
      const warnings = [];

      if (usersResult.status === 'fulfilled') {
        nextData.users = getSafeArray(usersResult.value);
      } else if (!currentUserIsAdmin && isForbidden(usersResult.reason)) {
        nextData.restrictedUsers = true;
        warnings.push('Bạn không có quyền xem toàn bộ người dùng, dashboard đang ẩn số liệu này.');
      } else {
        errors.push(usersResult.reason?.message || 'Không thể tải dữ liệu người dùng.');
      }

      if (borrowRecordsResult.status === 'fulfilled') {
        nextData.borrowRecords = getSafeArray(borrowRecordsResult.value);
      } else if (!currentUserIsAdmin && isForbidden(borrowRecordsResult.reason)) {
        nextData.restrictedBorrowRecords = true;
        warnings.push('Bạn không có quyền xem phiếu mượn, dashboard đang hiển thị giá trị thay thế.');
      } else {
        errors.push(borrowRecordsResult.reason?.message || 'Không thể tải dữ liệu phiếu mượn.');
      }

      if (booksResult.status === 'rejected') {
        errors.push(booksResult.reason?.message || 'Không thể tải dữ liệu sách.');
      }

      if (authorsResult.status === 'rejected') {
        errors.push(authorsResult.reason?.message || 'Không thể tải dữ liệu tác giả.');
      }

      if (categoriesResult.status === 'rejected') {
        errors.push(categoriesResult.reason?.message || 'Không thể tải dữ liệu danh mục.');
      }

      setDashboardData(nextData);
      setError(errors[0] || '');
      setWarning(warnings.join(' '));
      setLoading(false);
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const borrowedCount = dashboardData.borrowRecords.filter((record) => record.status === 'BORROWED').length;
    const overdueCount = dashboardData.borrowRecords.filter((record) => record.status === 'OVERDUE').length;

    return {
      totalBooks: dashboardData.books.length,
      totalAuthors: dashboardData.authors.length,
      totalCategories: dashboardData.categories.length,
      totalUsers: dashboardData.restrictedUsers ? '-' : dashboardData.users.length,
      borrowed: dashboardData.restrictedBorrowRecords ? '-' : borrowedCount,
      overdue: dashboardData.restrictedBorrowRecords ? '-' : overdueCount,
    };
  }, [dashboardData]);

  const activities = useMemo(() => {
    if (dashboardData.restrictedBorrowRecords) {
      return [];
    }

    return getLatestRecords(dashboardData.borrowRecords).map((record) => ({
      id: record.id,
      bookTitle: getBookTitle(record, dashboardData.books),
      userName: getUserDisplayName(record, dashboardData.users),
      status: record.status || 'UNKNOWN',
    }));
  }, [dashboardData]);

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Tổng quan hệ thống</h1>
      </header>

      {loading && <p className="dashboard-message dashboard-message--info">Đang tải dữ liệu dashboard...</p>}
      {!loading && error && <p className="dashboard-message dashboard-message--error">{error}</p>}
      {!loading && warning && <p className="dashboard-message dashboard-message--warning">{warning}</p>}

      <div className="stats-grid">
        <StatCard label="Tổng số sách" value={loading ? '...' : stats.totalBooks} className="primary" />
        <StatCard label="Tổng tác giả" value={loading ? '...' : stats.totalAuthors} />
        <StatCard label="Tổng danh mục" value={loading ? '...' : stats.totalCategories} />
        <StatCard label="Tổng người dùng" value={loading ? '...' : stats.totalUsers} />
        <StatCard label="Phiếu đang mượn" value={loading ? '...' : stats.borrowed} />
        <StatCard label="Phiếu quá hạn" value={loading ? '...' : stats.overdue} className="danger" />
      </div>

      <div className="content-grid">
        <section className="panel activity-panel">
          <h2>Hoạt động gần đây</h2>
          <ul className="activity-list">
            {loading && <li className="activity-item">Đang tải hoạt động gần đây...</li>}

            {!loading && dashboardData.restrictedBorrowRecords && (
              <li className="activity-item activity-item--muted">Bạn không có quyền xem hoạt động mượn trả gần đây.</li>
            )}

            {!loading && !dashboardData.restrictedBorrowRecords && activities.length === 0 && (
              <li className="activity-item activity-item--muted">Chưa có hoạt động mượn trả gần đây.</li>
            )}

            {!loading &&
              !dashboardData.restrictedBorrowRecords &&
              activities.map((activity) => (
                <li key={activity.id} className="activity-item">
                  <div className="activity-item__text">
                    <strong>{activity.bookTitle}</strong> - {activity.userName}
                  </div>
                  <div className="activity-item__meta">Trạng thái: {activity.status}</div>
                </li>
              ))}
          </ul>
        </section>

        <aside className="panel notes-panel">
          <h2>Ghi chú quản trị</h2>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
          />
        </aside>
      </div>
    </section>
  );
}

export default DashboardPage;
