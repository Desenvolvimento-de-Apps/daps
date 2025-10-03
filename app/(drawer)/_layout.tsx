import { Drawer } from 'expo-router/drawer';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function DrawerLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const isWelcomeScreen =
      segments.length > 1 && (segments[1] as string | undefined) === 'index';

    if (isLoading || inAuthGroup) {
      return;
    }

    // Se não estiver autenticado E não estiver na tela de boas-vindas, redireciona
    if (!isAuthenticated && !isWelcomeScreen) {
      router.replace('/(auth)');
    }
  }, [isLoading, isAuthenticated, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#88C9BF" />
      </View>
    );
  }

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 4. A tela 'index' está de volta ao menu */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Início',
          title: 'Bem-vindo',
        }}
      />
      <Drawer.Screen
        name="pets"
        options={{
          drawerLabel: 'Adotar',
          title: 'Adotar',
        }}
      />
      <Drawer.Screen
        name="register-pet"
        options={{
          drawerLabel: 'Cadastrar Animal',
          title: 'Cadastrar Animal',
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          drawerLabel: 'Favoritos',
          title: 'Favoritos',
        }}
      />
      <Drawer.Screen
        name="meus-pets"
        options={{
          drawerLabel: 'Meus Pets',
          title: 'Meus Pets',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
        }}
      />
    </Drawer>
  );
}
