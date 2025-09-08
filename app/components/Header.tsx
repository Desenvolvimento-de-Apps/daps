import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface HeaderProps {
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  title?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export default function Header({
  leftAction,
  rightAction,
  containerStyle,
  title,
  titleStyle,
}: HeaderProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.actionContainer}>{leftAction}</View>
      <View style={styles.titleContainer}>
        {title && <Text style={[styles.text, titleStyle]}>{title}</Text>}
      </View>
      <View style={styles.actionContainer}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFD358', // Cor base do design
    height: 60,
    paddingHorizontal: 16,
  },
  actionContainer: {
    // Garante que os ícones tenham um espaço fixo
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#434343', // Cor do texto do design
  },
});
