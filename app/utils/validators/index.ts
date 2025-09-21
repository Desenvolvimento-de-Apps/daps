export default function validateFormField(
  name: string,
  value: string | string[] | null,
  minLength?: number,
): string | null {
  if (minLength && typeof value === 'string' && value.length < minLength) {
    return `Este campo deve ter pelo menos ${minLength} caracteres`;
  }

switch (name) {
    case 'email':
      if (typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'E-mail inválido';
      }
      return null;
    // case 'idade':
    //   if (typeof value === 'string') {
    //     return /^\d+$/.test(value) && Number(value) >= 0 ? null : 'Idade deve ser um número válido';
    //   }
    //   return null;
    // case 'telefone':
    //   if (typeof value === 'string') {
    //     return value.length >= 10 ? null : 'Telefone inválido';
    //   }
    //   return null;
    case 'senha':
      if (typeof value === 'string') {
        return value.length >= 6 ? null : 'Senha deve ter pelo menos 6 caracteres';
      }
      return null;
    case 'nomeUsuario':
      if (typeof value === 'string') {
        const usuarioRegex = /^[a-zA-Z0-9_]+$/;
        return usuarioRegex.test(value)
          ? null
          : 'Apenas letras, números e underlines são permitidos.';
      }
      return null;
    default:
      return null;
  }
}
