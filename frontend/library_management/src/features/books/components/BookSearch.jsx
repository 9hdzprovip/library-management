import Input from '../../../components/common/Input/Input';

function BookSearch({ filters = {}, onChange, authors = [], categories = [] }) {
  function handleChange(field) {
    return (e) => {
      const value = e.target.value;
      onChange && onChange({ ...filters, [field]: value });
    };
  }

  return (
    <div className="book-search">
      <Input placeholder="Tìm theo tiêu đề..." value={filters.title || ''} onChange={handleChange('title')} />

      <select value={filters.authorId || ''} onChange={handleChange('authorId')}>
        <option value="">Tất cả tác giả</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select value={filters.categoryId || ''} onChange={handleChange('categoryId')}>
        <option value="">Tất cả danh mục</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}

export default BookSearch;
