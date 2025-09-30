import { auth, db, storage } from '@/firebaseConfig';
import { Pet, PetFormData } from '@/types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert } from 'react-native';

/**
 * Cria um novo documento de pet no Firestore.
 * @param petData Os dados do formulário do pet.
 */
export const createPet = async (petData: PetFormData): Promise<void> => {
  const user = auth.currentUser;

  // Validação inicial para garantir que há um usuário logado
  if (!user) {
    // A função lança um erro que será capturado no 'catch' do componente.
    throw new Error('Você precisa estar logado para cadastrar um pet.');
  }

  // Busca os dados do usuário para obter a localização
  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  let location = 'Localização não informada';
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    if (userData.cidade && userData.estado) {
      location = `${userData.cidade.toUpperCase()} - ${userData.estado.toUpperCase()}`;
    }
  }

  // Prepara o objeto de dados a ser salvo
  const petDocRef = doc(collection(db, 'pets'));
  const petDataToSave = {
    ...petData,
    ownerUid: user.uid,
    petId: petDocRef.id,
    location: location,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Salva o documento no Firestore
  await setDoc(petDocRef, petDataToSave);
};

export const getPets = async (): Promise<Pet[]> => {
  try {
    const petsCollectionRef = collection(db, 'pets');
    const querySnapshot = await getDocs(petsCollectionRef);
    const pets: Pet[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      pets.push({
        id: doc.id,
        name: data.nome,
        sex: data.sexo,
        age: data.idade,
        size: data.porte,
        image: data.image,
        location: data.location || 'Localização não informada',
      });
    });

    return pets;
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    throw new Error('Não foi possível buscar os pets.');
  }
};

export const uploadImageAsync = async (uri: string, fileName: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erro no upload da imagem: ', error);
    Alert.alert('Erro', 'Não foi possível enviar a imagem.');
    return null;
  }
};
