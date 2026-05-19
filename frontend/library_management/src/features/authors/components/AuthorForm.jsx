import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';

function AuthorForm({ initialData = null, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setBiography(initialData.biography || '');
    } else {
      setName('');
      setBiography('');
    }
    setError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên tác giả không được để trống');
      return;
    }
    onSave({ name: name.trim(), biography: biography.trim() });
  }

  return (
    <form className="author-form" onSubmit={handleSubmit}>
      <Input label="Tên" name="name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
      <Input label="Tiểu sử" name="biography" value={biography} onChange={(e) => setBiography(e.target.value)} />

      <div className="author-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </form>
  );
}

export default AuthorForm;
