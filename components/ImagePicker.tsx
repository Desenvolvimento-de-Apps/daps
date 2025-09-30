import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface GenericImagePickerProps {
  onImagePicked: (uri: string) => void;
  children: React.ReactNode;
  pickerOptions?: Partial<ImagePicker.ImagePickerOptions>;
}

export default function CustomImagePicker({
  onImagePicked,
  children,
  pickerOptions,
}: GenericImagePickerProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      alert('Desculpe, precisamos da permissão para acessar suas fotos!');
      return;
    }

    const defaultOptions: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    };

    const result = await ImagePicker.launchImageLibraryAsync({
      ...defaultOptions,
      ...pickerOptions,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return <TouchableOpacity onPress={pickImage}>{children}</TouchableOpacity>;
}
