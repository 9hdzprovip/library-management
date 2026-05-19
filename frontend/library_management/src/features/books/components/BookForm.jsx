import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function BookForm({ initialData = null, onSave, onCancel, authors = [], categories = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPublisher(initialData.publisher || '');
      setPublishYear(initialData.publishYear || '');
      setQuantity(initialData.quantity ?? 0);
      setAvailableQuantity(initialData.availableQuantity ?? 0);
      setAuthorId(initialData.authorId ?? '');
      setCategoryId(initialData.categoryId ?? '');
    } else {
      setTitle('');
      setDescription('');
      setPublisher('');
      setPublishYear('');
      setQuantity(0);
      setAvailableQuantity(0);
      setAuthorId('');
      setCategoryId('');
    }
    setError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return setError('Tiêu đề không được để trống');
    if (quantity < 0) return setError('Số lượng phải >= 0');
    if (availableQuantity < 0) return setError('Số lượng tồn phải >= 0');
    if (availableQuantity > quantity) return setError('Số lượng tồn không thể lớn hơn tổng số lượng');
    if (!authorId) return setError('Vui lòng chọn tác giả');
    if (!categoryId) return setError('Vui lòng chọn danh mục');

    onSave({
      title: title.trim(),
      description: description.trim(),
      publisher: publisher.trim(),
      publishYear: publishYear ? Number(publishYear) : null,
      quantity: Number(quantity),
      availableQuantity: Number(availableQuantity),
      authorId: Number(authorId),
      categoryId: Number(categoryId),
    });
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <Input label="Tiêu đề" name="title" value={title} onChange={(e) => setTitle(e.target.value)} error={error} />
      <Input label="Mô tả" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input label="Nhà xuất bản" name="publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
      <Input label="Năm xuất bản" name="publishYear" type="number" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} />

      <div className="book-form__row">
        <Input label="Số lượng" name="quantity" type="number" min="0" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <Input label="Số lượng tồn" name="availableQuantity" type="number" min="0" value={availableQuantity} onChange={(e) => setAvailableQuantity(Number(e.target.value))} />
      </div>

      <label> Tác giả </label>
      <select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
        <option value="">Chọn tác giả</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <label> Danh mục </label>
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Chọn danh mục</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <div className="book-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </form>
  );
}

export default BookForm;
