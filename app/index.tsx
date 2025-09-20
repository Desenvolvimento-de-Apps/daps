import { Redirect } from 'expo-router';

export default function AppIndex() {
  // Redireciona o utilizador para a tela inicial dentro do layout do drawer.
  return <Redirect href="/(drawer)" />;
}
