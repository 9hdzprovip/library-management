import BorrowTable from '../components/BorrowTable';
import '../styles/borrowRecord.css';

function BorrowRecordPage() {
  return (
    <section className="borrow-record-page stack">
      <div className="page-header">
        <div>
          <h2>Borrow Records</h2>
          <p>Manage borrowed and returned books.</p>
        </div>
      </div>
      <BorrowTable records={[]} />
    </section>
  );
}

export default BorrowRecordPage;
