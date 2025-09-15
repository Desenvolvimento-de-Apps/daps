import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface AdicionarFotoButtonProps {
    onPress: (event: GestureResponderEvent) => void
    style?: object
}

const AdicionarFotoButton = ({ onPress, style }: AdicionarFotoButtonProps) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.circle}>
        <Text style={styles.plusSign}>+</Text>
      </View>
      <Text style={styles.text}>adicionar foto</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    backgroundColor: '#f0f0f0', // Cor de fundo cinza claro
    borderRadius: 12, // Bordas arredondadas
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    // Sombra para Android
    elevation: 5,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Metade da largura/altura para formar um círculo perfeito
    borderWidth: 2,
    borderColor: '#a9a9a9', // Cor do círculo e do "+"
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Espaço entre o círculo e o texto
  },
  plusSign: {
    color: '#a9a9a9',
    fontSize: 30,
    fontWeight: '300', // Um peso mais fino para o sinal
    // Ajuste fino para centralizar o "+" verticalmente dentro do círculo
    lineHeight: 32,
  },
  text: {
    color: '#a9a9a9',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdicionarFotoButton;