import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  PenTool,
  Tags,
  Users,
  FileText,
  AlertTriangle,
  Activity,
  FileEdit,
  CheckCircle,
  Clock
} from 'lucide-react';
import * as authorApi from '../../api/authorApi';
import * as bookApi from '../../api/bookApi';
import * as borrowRecordApi from '../../api/borrowRecordApi';
import * as categoryApi from '../../api/categoryApi';
import * as userApi from '../../api/userApi';
import './DashboardPage.css';

function StatCard({ label, value, className, icon: Icon }) {
  return (
    <div className={`stat-card ${className || ''}`}>
      <div className="stat-card__main">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
      {Icon && (
        <div className="stat-card__icon-wrapper">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}

function getSafeArray(data) {
  return Array.isArray(data) ? data : [];
}

// Map status to badge style & icon
const statusConfig = {
  BORROWED: { class: 'badge-primary', text: 'Đang mượn', icon: Clock },
  RETURNED: { class: 'badge-success', text: 'Đã trả', icon: CheckCircle },
  OVERDUE: { class: 'badge-danger', text: 'Quá hạn', icon: AlertTriangle },
};

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

      try {
        if (currentUserIsAdmin) {
          const [books, authors, categories, users, borrowRecords] = await Promise.all([
            bookApi.getAll(),
            authorApi.getAll(),
            categoryApi.getAll(),
            userApi.getAll(),
            borrowRecordApi.getAll(),
          ]);

          if (!isMounted) return;

          setDashboardData({
            books: getSafeArray(books),
            authors: getSafeArray(authors),
            categories: getSafeArray(categories),
            users: getSafeArray(users),
            borrowRecords: getSafeArray(borrowRecords),
            restrictedUsers: false,
            restrictedBorrowRecords: false,
          });
        } else {
          // If USER role, only load what they can see
          const [books, authors, categories] = await Promise.all([
            bookApi.getAll(),
            authorApi.getAll(),
            categoryApi.getAll(),
          ]);

          if (!isMounted) return;

          setDashboardData({
            books: getSafeArray(books),
            authors: getSafeArray(authors),
            categories: getSafeArray(categories),
            users: [],
            borrowRecords: [],
            restrictedUsers: true,
            restrictedBorrowRecords: true,
          });
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'Không thể tải dữ liệu dashboard.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
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

  const isAdmin = isAdminUser();

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Tổng quan hệ thống</h1>
      </header>

      {loading && <p className="dashboard-message dashboard-message--info">Đang tải dữ liệu dashboard...</p>}
      {!loading && error && <p className="dashboard-message dashboard-message--error">{error}</p>}
      {!loading && warning && <p className="dashboard-message dashboard-message--warning">{warning}</p>}

      <div className="stats-grid">
        <StatCard label="Tổng số sách" value={loading ? '...' : stats.totalBooks} className="stat-card--primary" icon={BookOpen} />
        <StatCard label="Tổng tác giả" value={loading ? '...' : stats.totalAuthors} className="stat-card--indigo" icon={PenTool} />
        <StatCard label="Tổng danh mục" value={loading ? '...' : stats.totalCategories} className="stat-card--success" icon={Tags} />
        {isAdmin && <StatCard label="Tổng người dùng" value={loading ? '...' : stats.totalUsers} className="stat-card--warning" icon={Users} />}
        {isAdmin && <StatCard label="Phiếu đang mượn" value={loading ? '...' : stats.borrowed} className="stat-card--info" icon={FileText} />}
        {isAdmin && <StatCard label="Phiếu quá hạn" value={loading ? '...' : stats.overdue} className="stat-card--danger" icon={AlertTriangle} />}
      </div>

      {isAdmin && (
        <div className="content-grid">
          <section className="panel activity-panel">
            <div className="panel-header">
              <Activity className="panel-icon panel-icon--activity" size={20} />
              <h2>Hoạt động gần đây</h2>
            </div>
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
                activities.map((activity) => {
                  const config = statusConfig[activity.status] || { class: 'badge-primary', text: activity.status, icon: Clock };
                  const StatusIcon = config.icon;

                  return (
                    <li key={activity.id} className="activity-item">
                      <div className="activity-item__content">
                        <div className="activity-item__details">
                          <span className="activity-item__user">{activity.userName}</span>
                          <span className="activity-item__action"> đã mượn cuốn </span>
                          <strong className="activity-item__book">"{activity.bookTitle}"</strong>
                        </div>
                        <span className={`badge ${config.class} activity-item__badge`}>
                          <StatusIcon size={12} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} />
                          {config.text}
                        </span>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>
        </div>
      )}
    </section>
  );
}

export default DashboardPage;
