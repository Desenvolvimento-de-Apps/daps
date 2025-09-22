const cep = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

const phone = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};

const InputMasks = {
  cep,
  phone,
  unmask,
};

export default InputMasks;