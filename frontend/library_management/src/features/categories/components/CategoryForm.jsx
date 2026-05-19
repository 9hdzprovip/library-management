import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function CategoryForm({ initialData = null, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên không được để trống');
      return;
    }
    onSave({ name: name.trim(), description: description.trim() });
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <Input label="Tên" name="name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <Input label="Mô tả" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <div className="category-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </form>
  );
}

export default CategoryForm;
