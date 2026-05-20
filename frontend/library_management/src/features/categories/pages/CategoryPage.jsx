import { useCallback, useEffect, useMemo, useState } from 'react';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import * as categoryApi from '../../../api/categoryApi';
import '../styles/category.css';

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function sortById(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return [...data].sort((a, b) => Number(a.id) - Number(b.id));
}

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await categoryApi.getAll();
      setCategories(sortById(data));
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách danh mục.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((category) => category.name?.toLowerCase().includes(q));
  }, [categories, searchTerm]);

  function openAdd() {
    setError('');
    setEditingCategory(null);
    setIsModalOpen(true);
  }

  function openEdit(item) {
    setError('');
    setEditingCategory(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingCategory(null);
  }

  async function handleSave(data) {
    try {
      setError('');

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, data);
      } else {
        await categoryApi.create(data);
      }

      closeModal();
      await loadCategories();
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể lưu thông tin danh mục.'));
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa danh mục "${item.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setError('');
      await categoryApi.delete(item.id);
      await loadCategories();
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể xóa danh mục.'));
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
          <Input placeholder="Tìm theo tên danh mục..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Button onClick={openAdd} variant="primary">Thêm danh mục</Button>
        </div>
      </div>

      {error && !isModalOpen && <p className="category-page__error">{error}</p>}

      <CategoryTable categories={filtered} loading={loading} onEdit={openEdit} onDelete={handleDelete} />

      <Modal title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'} isOpen={isModalOpen} onClose={closeModal}>
        {error && <p className="category-page__error category-page__error--modal">{error}</p>}
        <CategoryForm initialData={editingCategory} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </section>
  );
}

export default CategoryPage;
