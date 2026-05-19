export function validateRequired(values, fields) {
  return fields.reduce((errors, field) => {
    if (!values[field]) {
      errors[field] = 'This field is required.';
    }

    return errors;
  }, {});
}
