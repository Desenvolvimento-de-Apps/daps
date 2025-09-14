import { ImageProps } from 'expo-image';

export interface Pet {
  id: string;
  name: string;
  image: ImageProps['source'];
  sex: 'MACHO' | 'FÊMEA';
  age: 'FILHOTE' | 'ADULTO';
  size: 'PEQUENO' | 'MÉDIO' | 'GRANDE';
  location: string;
}
