import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import * as Notifications from 'expo-notifications';

// Impede que a tela de splash seja ocultada automaticamente.
SplashScreen.preventAutoHideAsync();

// Configura como as notificações devem se comportar com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // --- MODIFICAÇÃO: Listener para interação com notificações ---
  useEffect(() => {
    // Este listener é acionado quando o usuário toca em uma notificação
    // (seja com o app aberto, em segundo plano ou fechado)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // Extrai dados da notificação, como o ID do pet que enviamos da Cloud Function
        const petId = response.notification.request.content.data
          ?.petId as string;

        // Navega para a tela de informações do pet
        if (petId) {
          console.log('Notificação recebida, navegando para o pet:', petId);
          router.push({ pathname: '/(drawer)/pets/info', params: { petId } });
        }
      },
    );

    // Limpa o listener quando o componente é desmontado
    return () => subscription.remove();
  }, []);
  // -----------------------------------------------------------

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
