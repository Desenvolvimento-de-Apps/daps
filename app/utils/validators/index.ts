export const validateEmail = (
  email?: string,
  minLength?: number,
): string | null => {
  if (!email) {
    return null;
  }

  if (minLength && email.length < minLength) {
    return `O e-mail deve ter pelo menos ${minLength} caracteres.`;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return 'Formato de e-mail inválido.';
  }

  return null;
};

export const validateNomeUsuario = (nomeUsuario?: string): string | null => {
  if (!nomeUsuario) {
    return null;
  }

  console.log('TO AQUI!');

  const usuarioRegex = /^[a-zA-Z0-9_]+$/;

  if (!usuarioRegex.test(nomeUsuario)) {
    return 'Nome de usuário inválido. Apenas letras, números e underlines são permitidos.';
  }

  return null;
};

export default function validateFormField(
  name: string,
  value: string | string[],
  minLength?: number,
): string | null {
  switch (name) {
    case 'email':
      return validateEmail(value as string, minLength);
    default:
      return null;
  }
}
