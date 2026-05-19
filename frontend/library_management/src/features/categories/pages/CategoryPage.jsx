import { useEffect, useMemo, useState } from 'react';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as categoryApi from '../../../api/categoryApi';
import '../styles/category.css';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setLoading(true);
    categoryApi.fetchCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  function openAdd() {
    setEditing(null);
    setIsModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditing(null);
  }

  async function handleSave(data) {
    if (editing) {
      const updated = await categoryApi.updateCategory(editing.id, data);
      setCategories((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await categoryApi.createCategory(data);
      setCategories((prev) => [created, ...prev]);
    }
    closeModal();
  }

  async function handleDelete(item) {
    setCategories((prev) => prev.filter((c) => c.id !== item.id));
    try {
      await categoryApi.deleteCategory(item.id);
    } catch (e) {
      setCategories((prev) => [item, ...prev]);
    }
  }

  return (
    <section className="category-page">
      <div className="page-header page-header--space">
        <div>
          <h1>Quản lý danh mục</h1>
          <p>Danh sách và quản lý danh mục sách.</p>
        </div>

        <div className="page-actions">
          <Input placeholder="Tìm theo tên danh mục..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button onClick={openAdd} variant="primary">Thêm danh mục</Button>
        </div>
      </div>

      <CategoryTable categories={filtered} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <Modal title={editing ? 'Sửa danh mục' : 'Thêm danh mục'} isOpen={isModalOpen} onClose={closeModal}>
        <CategoryForm initialData={editing} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </section>
  );
}

export default CategoryPage;
