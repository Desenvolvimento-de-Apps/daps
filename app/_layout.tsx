import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Impede que a tela de splash seja ocultada automaticamente antes do carregamento das fontes.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carrega as fontes personalizadas.
  const [fontsLoaded, error] = useFonts({
    'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  // Exibe um erro se as fontes não puderem ser carregadas.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Oculta a tela de splash assim que as fontes forem carregadas.
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Não renderiza nada até que as fontes estejam carregadas para evitar "font flicker".
  if (!fontsLoaded) {
    return null;
  }

  // Configuração do navegador de Stack do Expo Router.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="adopt" options={{ headerShown: false }} />
      <Stack.Screen name="finish" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro-pessoal" options={{ headerShown: false }} />
      <Stack.Screen name="register-pet" options={{ headerShown: false }} />
      <Stack.Screen name="auth-options" options={{ headerShown: false }} />
    </Stack>
  );
}
