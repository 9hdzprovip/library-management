import './Input.css';

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  ...props
}) {
  const inputId = props.id || name;

  return (
    <div className="input-field">
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
        {...props}
      />
      {error && <p className="input-field__error">{error}</p>}
    </div>
  );
}

export default Input;
