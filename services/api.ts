import { auth, db, storage } from '@/firebaseConfig';
import { ChatMessage, Pet, PetDetails, PetFormData, UserData } from '@/types';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert } from 'react-native';

/**
 * Registra um novo usuário no Firebase Auth e Firestore.
 * @param values Os dados do formulário do usuário.
 * @param userImage A URI da imagem de perfil selecionada (opcional).
 */

export const registerUser = async (
  values: UserData,
  userImage: string | null,
): Promise<void> => {
  let userCredential: UserCredential | null = null;
  let userImageUrl: string | null = null;
  const { email, senha, ...userData } = values;

  try {
    // 1. Criar usuário no Firebase Authentication
    userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;

    // 2. Verificar se o nome de usuário já existe
    const usernameRef = doc(db, 'usernames', userData.nomeUsuario);
    const usernameDoc = await getDoc(usernameRef);

    if (usernameDoc.exists()) {
      throw new FirebaseError(
        'auth/username-already-in-use',
        'Este nome de usuário já está em uso.',
      );
    }

    // 3. Salvar o mapeamento nome de usuário -> UID
    await setDoc(usernameRef, { uid });

    // 4. Salvar os dados do usuário no Firestore
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      image: null, // Inicia como nulo, será atualizado após o upload
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 5. Fazer upload da imagem de perfil, se houver
    if (userImage) {
      const fileName = `images/users/${uid}-${new Date().getTime()}.jpg`;
      userImageUrl = await uploadImageAsync(userImage, fileName);
      if (userImageUrl) {
        await setDoc(
          userRef,
          { image: userImageUrl, updatedAt: serverTimestamp() },
          { merge: true },
        );
      }
    }

    await updateProfile(userCredential.user, {
      displayName: userData.nomeUsuario,
      photoURL: userImageUrl
    });
  } catch (error) {
    if (userCredential) {
      try {
        await userCredential.user.delete();
      } catch (e) {
        console.warn(
          'Falha ao remover usuário órfão após erro no cadastro:',
          e,
        );
      }
    }
    throw error;
  }
};

/**
 * Faz upload de uma imagem para o Firebase Storage.
 * @param uri A URI local da imagem.
 * @param fileName O nome do arquivo no Storage.
 * @returns A URL de download da imagem ou null em caso de erro.
 */
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
    isVisible: true,
  };

  // Salva o documento no Firestore
  await setDoc(petDocRef, petDataToSave);
};

export const getPets = async (): Promise<Pet[]> => {
  try {
    const petsCollectionRef = collection(db, 'pets');
    const q = query(petsCollectionRef, where('isVisible', '==', true));
    const querySnapshot = await getDocs(q);

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
        isVisible: data.isVisible ?? true,
      });
    });

    return pets;
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    throw new Error('Não foi possível buscar os pets.');
  }
};

export const getPetById = async (petId: string): Promise<PetDetails | null> => {
  try {
    const petDocRef = doc(db, 'pets', petId);
    const petDocSnap = await getDoc(petDocRef);

    if (petDocSnap.exists()) {
      const data = petDocSnap.data();

      const petDetails: PetDetails = {
        id: petDocSnap.id,
        name: data.nome,
        image: data.image,
        location: data.location || 'Não informado',
        sex: data.sexo,
        age: data.idade,
        size: data.porte,
        species: data.especie,
        temperament: data.temperamento,
        health: data.saude,
        diseases: data.doencas,
        requirements: data.exigencias,
        about: data.sobre,
        ownerUid: data.ownerUid,
      };

      return petDetails;
    } else {
      console.warn(`Nenhum pet encontrado com o ID: ${petId}`);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar pet por ID:', error);
    throw new Error('Não foi possível buscar os dados do pet.');
  }
};

/**
 * Busca todos os pets favoritados por um usuário.
 * @param userId O UID do usuário.
 * @returns Uma lista com os detalhes completos dos pets favoritados.
 */
export const getFavoritePets = async (
  userId: string,
): Promise<PetDetails[]> => {
  try {
    const favoritesCollectionRef = collection(db, 'users', userId, 'favorites');
    const querySnapshot = await getDocs(favoritesCollectionRef);

    if (querySnapshot.empty) {
      return [];
    }

    // Mapeia cada documento de favorito para uma promise que busca os detalhes do pet
    const petPromises = querySnapshot.docs.map((doc) => {
      const petId = doc.data().petId;
      return getPetById(petId);
    });

    // Aguarda todas as buscas de pets terminarem
    const pets = await Promise.all(petPromises);

    // Filtra resultados nulos (caso um pet tenha sido deletado mas ainda esteja nos favoritos)
    return pets.filter((pet): pet is PetDetails => pet !== null);
  } catch (error) {
    console.error('Erro ao buscar pets favoritos:', error);
    throw new Error('Não foi possível buscar os pets favoritos.');
  }
};

/**
 * Verifica se um pet está na lista de favoritos de um usuário.
 * @param userId O UID do usuário.
 * @param petId O ID do pet.
 * @returns `true` se o pet for favorito, `false` caso contrário.
 */
export const isPetFavorited = async (
  userId: string,
  petId: string,
): Promise<boolean> => {
  try {
    const favoriteRef = doc(db, 'users', userId, 'favorites', petId);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return false; // Retorna false em caso de erro para não bloquear a UI
  }
};

/**
 * Adiciona um pet à lista de favoritos de um usuário.
 * @param userId O UID do usuário.
 * @param petId O ID do pet.
 */
export const addFavoritePet = async (
  userId: string,
  petId: string,
): Promise<void> => {
  try {
    const favoriteRef = doc(db, 'users', userId, 'favorites', petId);
    await setDoc(favoriteRef, {
      petId: petId,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    throw new Error('Não foi possível adicionar o pet aos favoritos.');
  }
};

/**
 * Remove um pet da lista de favoritos de um usuário.
 * @param userId O UID do usuário.
 * @param petId O ID do pet.
 */
export const removeFavoritePet = async (
  userId: string,
  petId: string,
): Promise<void> => {
  try {
    const favoriteRef = doc(db, 'users', userId, 'favorites', petId);
    await deleteDoc(favoriteRef);
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    throw new Error('Não foi possível remover o pet dos favoritos.');
  }
};

/**
 * Busca todos os pets cadastrados pelo usuário logado.
 * @returns Uma lista de pets do usuário.
 */
export const getPetsByOwner = async (): Promise<Pet[]> => {
  const user = auth.currentUser;

  if (!user) {
    console.log('Nenhum usuário logado para buscar os pets.');
    return [];
  }

  try {
    const petsCollectionRef = collection(db, 'pets');

    // Cria uma query para buscar documentos na coleção 'pets'
    // onde o campo 'ownerUid' seja igual ao UID do usuário logado.
    const q = query(petsCollectionRef, where('ownerUid', '==', user.uid));

    const querySnapshot = await getDocs(q);
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
        isVisible: data.isVisible ?? true,
      });
    });

    return pets;
  } catch (error) {
    console.error('Erro ao buscar os pets do usuário:', error);
    throw new Error('Não foi possível buscar seus pets.');
  }
};

/**
 * Atualiza o status de visibilidade de um pet.
 * @param petId O ID do pet a ser atualizado.
 * @param isVisible O novo status de visibilidade (true ou false).
 */
export const updatePetVisibility = async (
  petId: string,
  isVisible: boolean,
): Promise<void> => {
  try {
    const petRef = doc(db, 'pets', petId);
    await updateDoc(petRef, {
      isVisible: isVisible,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao atualizar a visibilidade do pet:', error);
    throw new Error('Não foi possível alterar a visibilidade do pet.');
  }
};

/**
 * Busca os dados de um usuário específico pelo seu UID.
 * @param userId O UID do usuário a ser buscado.
 * @returns Os dados do usuário ou null se não for encontrado.
 */
export const getUserDataById = async (
  userId: string,
): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() } as unknown as UserData;
    } else {
      console.warn(`Usuário com ID ${userId} não encontrado.`);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw new Error('Não foi possível buscar os dados do usuário.');
  }
};

/**
 * Registra o interesse do usuário logado em um pet específico.
 * @param petId O ID do pet no qual o usuário está interessado.
 */
export const markInterestInPet = async (petId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Você precisa estar logado para demonstrar interesse.');
  }

  try {
    const interestRef = doc(db, 'pets', petId, 'interestedUsers', user.uid);
    await setDoc(interestRef, {
      userId: user.uid,
      interestedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao marcar interesse:', error);
    throw new Error('Não foi possível registrar seu interesse no pet.');
  }
};

/**
 * Busca todos os usuários que demonstraram interesse em um pet específico.
 * @param petId O ID do pet.
 * @returns Uma lista com os dados completos dos usuários interessados.
 */
export const getInterestedUsersForPet = async (
  petId: string,
): Promise<UserData[]> => {
  try {
    const interestCollectionRef = collection(
      db,
      'pets',
      petId,
      'interestedUsers',
    );
    const querySnapshot = await getDocs(interestCollectionRef);

    if (querySnapshot.empty) {
      return []; // Retorna um array vazio se ninguém demonstrou interesse
    }

    // Mapeia cada documento de interesse para uma promise que busca os dados do usuário
    const userPromises = querySnapshot.docs.map((doc) => {
      const userId = doc.data().userId;
      return getUserDataById(userId);
    });

    // Aguarda todas as buscas de usuários terminarem
    const users = await Promise.all(userPromises);

    // Filtra resultados nulos (caso um usuário tenha sido deletado)
    return users.filter((user): user is UserData => user !== null);
  } catch (error) {
    console.error('Erro ao buscar usuários interessados:', error);
    throw new Error('Não foi possível buscar a lista de interessados.');
  }
};

/**
 * Verifica se um usuário já marcou interesse em um pet.
 * @param userId O UID do usuário.
 * @param petId O ID do pet.
 * @returns `true` se o interesse já foi marcado, `false` caso contrário.
 */
export const hasUserMarkedInterest = async (
  userId: string,
  petId: string,
): Promise<boolean> => {
  try {
    const interestRef = doc(db, 'pets', petId, 'interestedUsers', userId);
    const docSnap = await getDoc(interestRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Erro ao verificar interesse:', error);
    return false;
  }
};

/**
 * Remove o interesse do usuário logado em um pet específico.
 * @param petId O ID do pet do qual o interesse será removido.
 */
export const removeInterestInPet = async (petId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Você precisa estar logado para realizar esta ação.');
  }

  try {
    // A referência aponta para o documento exato do interesse do usuário
    const interestRef = doc(db, 'pets', petId, 'interestedUsers', user.uid);
    // Deleta o documento, efetivamente removendo o interesse
    await deleteDoc(interestRef);
  } catch (error) {
    console.error('Erro ao remover interesse:', error);
    throw new Error('Não foi possível remover seu interesse no pet.');
  }
};

export const getUserChats = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const userChatsRef = collection(db, 'users', userId, 'chats');
    const userChatsSnap = await getDocs(userChatsRef);
    const chatKeys = userChatsSnap.docs.map((doc) => doc.id);

    if (chatKeys.length === 0) {
      return [];
    }

    const chatPromises = chatKeys.map(async (chatKey) => {
      const messagesRef = collection(db, 'chat', chatKey, 'messages');

      const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
      const msgSnapshot = await getDocs(q);
      const lastMessage = msgSnapshot.empty ? null : msgSnapshot.docs[0].data();

      const participants = chatKey.split('_');
      const otherUid =
        participants[0] === userId ? participants[1] : participants[0];
      const otherUserRef = doc(db, 'users', otherUid);
      const otherSnap = await getDoc(otherUserRef);
      const otherData = otherSnap.exists()
        ? otherSnap.data()
        : { name: 'Desconhecido', photoUrl: '' };

      return {
        userId: otherUid,
        name: otherData.nome,
        nickname: otherData.nomeUsuario,
        profileImageUrl: otherData.image,
        lastMessage: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage
          ? lastMessage.createdAt.toDate().toISOString()
          : null,
      };
    });

    const chats = await Promise.all(chatPromises);

    console.log('Chats fetched for user:', userId, chats);
    
    return chats;
  } catch (error) {
    console.error('Erro ao buscar conversas do usuário:', error);
    throw new Error('Não foi possível buscar suas conversas.');
  }
};

export const startChatBetweenUsers = async (
  userId1: string,
  userId2: string,
): Promise<string> => {
  try {
    const chatKey = [userId1, userId2].sort().join('_');

    const chatRef = doc(db, 'chat', chatKey);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {});
    }

    
    const user1ChatRef = doc(db, 'users', userId1, 'chats', chatKey);
    const user1ChatSnap = await getDoc(user1ChatRef);
    if (!user1ChatSnap.exists()) {
      await setDoc(user1ChatRef, { createdAt: serverTimestamp() });
    }

    const user2ChatRef = doc(db, 'users', userId2, 'chats', chatKey);
    const user2ChatSnap = await getDoc(user2ChatRef);
    if (!user2ChatSnap.exists()) {
      await setDoc(user2ChatRef, { createdAt: serverTimestamp() });
    }

    return chatKey;
  } catch (error) {
    console.error('Erro ao iniciar conversa:', error);
    throw new Error('Não foi possível iniciar a conversa.');
  }
};
