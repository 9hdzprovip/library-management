import CategoryTable from '../components/CategoryTable';
import '../styles/category.css';

function CategoryPage() {
  return (
    <section className="category-page stack">
      <div className="page-header">
        <div>
          <h2>Categories</h2>
          <p>Manage book categories.</p>
        </div>
      </div>
      <CategoryTable categories={[]} />
    </section>
  );
}

export default CategoryPage;
