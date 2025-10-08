import {
  ImagePickerAsset,
  ImagePickerOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';

interface GenericImagePickerProps {
  onImagePicked: (assets: ImagePickerAsset[]) => void;
  children: React.ReactNode;
  pickerOptions?: Partial<ImagePickerOptions>;
  multiple?: boolean;
  limitedSelection?: number;
  aspect?: [number, number];
  customStyle?: object;
}

export default function CustomImagePicker({
  onImagePicked,
  children,
  pickerOptions,
  multiple,
  limitedSelection,
  aspect,
  customStyle,
}: GenericImagePickerProps) {
  const defaultOptions: ImagePickerOptions = {
    allowsEditing: true,
    allowsMultipleSelection: multiple ?? true,
    selectionLimit: limitedSelection ?? 1,
    aspect: aspect ?? [4, 3],
    quality: 0.6,
  };

  const openCamera = async () => {
    const { status } = await requestCameraPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      Alert.alert(
        'Permissão necessária',
        'Desculpe, precisamos da permissão da câmera para continuar!',
      );
      return;
    }

    const result = await launchCameraAsync({
      ...defaultOptions,
      ...pickerOptions,
    });

    if (!result.canceled) {
      onImagePicked(result.assets);
    }
  };

  const openGallery = async () => {
    const { status } = await requestMediaLibraryPermissionsAsync();
    if (status !== PermissionStatus.GRANTED) {
      Alert.alert(
        'Permissão necessária',
        'Desculpe, precisamos da permissão para acessar suas fotos!',
      );
      return;
    }

    const result = await launchImageLibraryAsync({
      ...defaultOptions,
      ...pickerOptions,
    });

    if (!result.canceled) {
      onImagePicked(result.assets);
    }
  };

  const handlePickImage = () => {
    Alert.alert(
      'Selecionar Imagem',
      'Escolha de onde você quer pegar a foto:',
      [
        {
          text: 'Câmera',
          onPress: openCamera,
        },
        {
          text: 'Galeria',
          onPress: openGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity style={customStyle} onPress={handlePickImage}>
      {children}
    </TouchableOpacity>
  );
}
