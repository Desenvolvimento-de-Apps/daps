import { ImageSourcePropType } from 'react-native';

export type PetFormData = {
  nome: string;
  especie: string | null;
  sexo: string | null;
  porte: string | null;
  idade: string | null;
  temperamento: string[] | null;
  saude: string[] | null;
  doencas: string;
  exigencias: string[] | null;
  acompanhamento: string[] | null;
  sobre: string;
};

export type Pet = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  sex: 'MACHO' | 'FÊMEA';
  age: 'FILHOTE' | 'ADULTO' | 'IDOSO';
  size: 'PEQUENO' | 'MÉDIO' | 'GRANDE';
  location: string;
};

export type PetDetails = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  location: string;
  sex: 'MACHO' | 'FÊMEA' | null;
  age: 'FILHOTE' | 'ADULTO' | 'IDOSO' | null;
  size: 'PEQUENO' | 'MÉDIO' | 'GRANDE' | null;
  species: string | null;
  temperament: string[] | null;
  health: string[] | null;
  diseases: string;
  requirements: string[] | null;
  about: string;
  ownerUid: string;
};
