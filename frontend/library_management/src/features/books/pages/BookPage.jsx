import BookSearch from '../components/BookSearch';
import BookTable from '../components/BookTable';
import '../styles/book.css';

function BookPage() {
  return (
    <section className="book-page stack">
      <div className="page-header">
        <div>
          <h2>Books</h2>
          <p>Manage library books.</p>
        </div>
      </div>
      <BookSearch value="" onChange={() => {}} />
      <BookTable books={[]} />
    </section>
  );
}

export default BookPage;
