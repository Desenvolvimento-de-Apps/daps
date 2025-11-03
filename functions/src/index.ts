import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Inicializa o Firebase Admin e o Expo SDK
console.log('Inicializando Firebase Admin...');
admin.initializeApp();
console.log('Firebase Admin inicializado.');

console.log('Inicializando Expo SDK...');
const expo = new Expo();
console.log('Expo SDK inicializado.');

/**
 * Cloud Function que é acionada quando um novo pet é criado na coleção 'pets'.
 * Ela busca todos os tokens de notificação dos usuários e envia uma notificação.
 */
export const sendNotificationOnNewPet = functions
  .region('southamerica-east1') // É uma boa prática definir a região
  .firestore.document('pets/{petId}')
  .onCreate(async (snap, context) => {
    console.log('Função acionada pelo Firestore: pets/{petId}');
    const newPet = snap.data();
    console.log('Dados do novo pet:', newPet);

    const petName = newPet.nome || 'Um novo amiguinho';
    const petId = context.params.petId;
    console.log('Nome do pet:', petName);
    console.log('ID do pet:', petId);

    // 1. Buscar todos os usuários e seus tokens de notificação
    console.log('Buscando todos os usuários...');
    const usersSnapshot = await admin.firestore().collection('users').get();
    console.log('Total de usuários encontrados:', usersSnapshot.size);

    const pushTokens: string[] = [];

    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      console.log('Usuário:', user);
      if (user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
        console.log('Token válido encontrado:', user.pushToken);
        pushTokens.push(user.pushToken);
      } else {
        console.log('Token inválido ou inexistente para usuário:', doc.id);
      }
    });

    if (pushTokens.length === 0) {
      console.log('Nenhum token de notificação válido foi encontrado.');
      return null;
    }

    console.log(`Enviando notificação para ${pushTokens.length} dispositivos.`);
    console.log('Tokens:', pushTokens);

    // 2. Criar as mensagens de notificação
    const messages: ExpoPushMessage[] = [];
    for (const pushToken of pushTokens) {
      const message = {
        to: pushToken,
        sound: 'default',
        title: 'Novo Pet para Adoção! 🐾',
        body: `${petName} está esperando por um lar. Venha conhecer!`,
        data: { petId: petId, petName: petName, type: 'NEW_PET' },
      };
      console.log('Mensagem criada:', message);
      messages.push(message);
    }

    // 3. Enviar as notificações em lotes (chunks) para não sobrecarregar
    const chunks = expo.chunkPushNotifications(messages);
    console.log('Chunks de mensagens:', chunks.length);

    const tickets = [];

    try {
      for (const chunk of chunks) {
        console.log('Enviando chunk:', chunk);
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log('Lote de notificações enviado:', ticketChunk);
      }
    } catch (error) {
      console.error('Erro ao enviar as notificações push:', error);
    }

    console.log('Tickets recebidos:', tickets);

    console.log('Função finalizada com sucesso.');
    return { success: true, message: 'Notificações enviadas.' };
  });

/**
 * Cloud Function que é acionada quando um usuário demonstra interesse em um pet.
 * Ela busca o dono do pet e envia uma notificação apenas para ele.
 */
export const sendNotificationOnNewInterest = functions
  .region('southamerica-east1')
  .firestore.document('pets/{petId}/interestedUsers/{userId}')
  .onCreate(async (snap, context) => {
    console.log('Função acionada: pets/{petId}/interestedUsers/{userId}');

    const { petId, userId } = context.params;
    console.log(`Usuário ${userId} demonstrou interesse no pet ${petId}`);

    try {
      // 1. Buscar dados do pet (para pegar o nome e o ID do dono)
      const petRef = admin.firestore().doc(`pets/${petId}`);
      const petSnap = await petRef.get();
      if (!petSnap.exists) {
        console.error('Pet não encontrado:', petId);
        return null;
      }
      const petData = petSnap.data()!;
      const ownerUid = petData.ownerUid;
      const petName = petData.nome || 'seu pet';

      // 2. Não enviar notificação se o dono marcou interesse (caso raro)
      if (ownerUid === userId) {
        console.log('Dono marcou interesse no próprio pet. Sem notificação.');
        return null;
      }

      // 3. Buscar dados do usuário que demonstrou interesse (para pegar o nome)
      const interestedUserRef = admin.firestore().doc(`users/${userId}`);
      const interestedUserSnap = await interestedUserRef.get();
      if (!interestedUserSnap.exists) {
        console.error('Usuário interessado não encontrado:', userId);
        return null;
      }
      const interestedUserName = interestedUserSnap.data()?.nome || 'Alguém';

      // 4. Buscar dados do dono do pet (para pegar o push token)
      const ownerRef = admin.firestore().doc(`users/${ownerUid}`);
      const ownerSnap = await ownerRef.get();
      if (!ownerSnap.exists) {
        console.error('Dono do pet não encontrado:', ownerUid);
        return null;
      }
      const ownerToken = ownerSnap.data()?.pushToken;

      // 5. Validar o token do dono
      if (!ownerToken || !Expo.isExpoPushToken(ownerToken)) {
        console.log('Dono não possui um token de notificação válido.');
        return null;
      }

      // 6. Criar a mensagem de notificação
      const message: ExpoPushMessage = {
        to: ownerToken,
        sound: 'default',
        title: 'Novo Interesse! 💖',
        body: `${interestedUserName} está interessado(a) em adotar ${petName}!`,
        data: { petId: petId, petName: petName, type: 'NEW_INTEREST' },
      };

      console.log('Enviando notificação de interesse para:', ownerToken);

      // 7. Enviar a notificação
      await expo.sendPushNotificationsAsync([message]);

      console.log('Notificação de interesse enviada com sucesso.');
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar notificação de interesse:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });
