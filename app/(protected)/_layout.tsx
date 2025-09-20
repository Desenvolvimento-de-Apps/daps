import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Apenas verifique se não está carregando e não está autenticado.
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth-options');
    }
  }, [isLoading, isAuthenticated]); // Re-execute o efeito quando estes valores mudarem

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#88C9BF" />
      </View>
    );
  }

  // Se passou pelo loading e está autenticado, renderiza as rotas filhas.
  return <Stack screenOptions={{ headerShown: false }} />;
}
