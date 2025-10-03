import { Timestamp } from 'firebase/firestore';
import { ImageSourcePropType } from 'react-native';

/**
 * Define a estrutura de dados para o cadastro de um novo usuário.
 */
export type UserData = {
  nome: string;
  idade: string;
  email: string;
  estado: string;
  cidade: string;
  endereco: string;
  telefone: string;
  nomeUsuario: string;
  senha: string;
  confirmacaoSenha: string;
};

// --- Tipos existentes de Pet (mantidos para consistência) ---

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
  isVisible: boolean;
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

/**
 * Define a estrutura de um documento na subcoleção 'favorites'.
 */
export type Favorite = {
  petId: string;
  addedAt: Timestamp;
};
