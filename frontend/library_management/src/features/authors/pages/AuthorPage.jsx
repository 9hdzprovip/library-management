import AuthorTable from '../components/AuthorTable';
import '../styles/author.css';

function AuthorPage() {
  return (
    <section className="author-page stack">
      <div className="page-header">
        <div>
          <h2>Authors</h2>
          <p>Manage book authors.</p>
        </div>
      </div>
      <AuthorTable authors={[]} />
    </section>
  );
}

export default AuthorPage;
