import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false, // Esconde o header padrão do drawer
      }}
    >
      <Drawer.Screen
        name="index" // Corresponde ao arquivo app/(drawer)/index.tsx
        options={{
          drawerLabel: 'Início',
          title: 'Bem-vindo',
        }}
      />
      <Drawer.Screen
        name="settings" // Corresponde ao arquivo app/(drawer)/settings.tsx
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
        }}
      />
    </Drawer>
  );
}
