import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomSafeAreaProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function CustomSafeArea({
  children,
  style,
}: CustomSafeAreaProps) {
  return <SafeAreaView style={[defaultStyle, style]}>{children}</SafeAreaView>;
}

const defaultStyle: StyleProp<ViewStyle> = {
  flex: 1,
  backgroundColor: '#FAFAFA',
};
