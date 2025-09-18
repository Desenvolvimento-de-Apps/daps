import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomSafeArea from '../components/CustomSafeArea';

const SettingsScreen = () => {
  return (
    <CustomSafeArea style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configurações</Text>
        <Text>Esta é a página de configurações.</Text>
      </View>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SettingsScreen;
