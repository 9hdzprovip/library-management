import { Link } from 'react-router-dom';
import './UnauthorizedPage.css';

function UnauthorizedPage() {
  return (
    <section className="unauthorized-page">
      <h1>403</h1>
      <p>Bạn không có quyền truy cập trang này.</p>
      <Link className="unauthorized-page__link" to="/">
        Quay về dashboard
      </Link>
    </section>
  );
}

export default UnauthorizedPage;
