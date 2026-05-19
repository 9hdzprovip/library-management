import { useMemo, useState } from 'react';
import './DashboardPage.css';

function StatCard({ label, value, className }) {
  return (
    <div className={`stat-card ${className || ''}`}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function DashboardPage() {
  const stats = useMemo(
    () => ({
      totalBooks: 1248,
      totalAuthors: 312,
      totalCategories: 42,
      totalUsers: 981,
      borrowed: 127,
      overdue: 9,
    }),
    []
  );

  const activities = useMemo(
    () => [
      { id: 1, text: 'Người dùng Nguyễn Văn A mượn sách "Lập trình Java"' },
      { id: 2, text: 'Tác giả mới: Trần Thị B đã được thêm' },
      { id: 3, text: 'Danh mục "Khoa học" được cập nhật' },
    ],
    []
  );

  const [notes, setNotes] = useState(
    'Ghi chú quản trị: theo dõi tình trạng mượn trả, kiểm tra danh mục mới.'
  );

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <h1>Tổng quan hệ thống</h1>
      </header>

      <div className="stats-grid">
        <StatCard label="Tổng số sách" value={stats.totalBooks} className="primary" />
        <StatCard label="Tổng tác giả" value={stats.totalAuthors} />
        <StatCard label="Tổng danh mục" value={stats.totalCategories} />
        <StatCard label="Tổng người dùng" value={stats.totalUsers} />
        <StatCard label="Phiếu đang mượn" value={stats.borrowed} />
        <StatCard label="Phiếu quá hạn" value={stats.overdue} className="danger" />
      </div>

      <div className="content-grid">
        <section className="panel activity-panel">
          <h2>Hoạt động gần đây</h2>
          <ul className="activity-list">
            {activities.map((a) => (
              <li key={a.id} className="activity-item">
                <div className="activity-item__text">{a.text}</div>
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
