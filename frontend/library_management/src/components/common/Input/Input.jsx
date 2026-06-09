import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  icon: Icon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = props.id || name;
  const isPasswordType = type === 'password';
  const actualType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="input-field">
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`input-field__wrapper ${Icon ? 'input-field__wrapper--with-icon' : ''} ${isPasswordType ? 'input-field__wrapper--password' : ''}`}>
        {Icon && <Icon className="input-field__icon" size={16} />}
        <input
          id={inputId}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={actualType}
          value={value}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            className="input-field__password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="input-field__error">{error}</p>}
    </div>
  );
}

export default Input;
