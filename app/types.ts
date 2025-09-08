export interface Pet {
  id: string;
  name: string;
  image: string;
  sex: 'MACHO' | 'FÊMEA';
  age: 'FILHOTE' | 'ADULTO';
  size: 'PEQUENO' | 'MÉDIO' | 'GRANDE';
  location: string;
}
