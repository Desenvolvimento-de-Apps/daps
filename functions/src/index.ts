import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Inicializa o Firebase Admin e o Expo SDK
admin.initializeApp();
const expo = new Expo();

/**
 * Cloud Function que é acionada quando um novo pet é criado na coleção 'pets'.
 * Ela busca todos os tokens de notificação dos usuários e envia uma notificação.
 */
export const sendNotificationOnNewPet = functions
  .region('southamerica-east1') // É uma boa prática definir a região
  .firestore.document('pets/{petId}')
  .onCreate(async (snap, context) => {
    const newPet = snap.data();
    const petName = newPet.nome || 'Um novo amiguinho';
    const petId = context.params.petId; // Pega o ID do documento criado

    // 1. Buscar todos os usuários e seus tokens de notificação
    const usersSnapshot = await admin.firestore().collection('users').get();
    const pushTokens: string[] = [];

    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      // Adiciona o token se ele existir e for um token Expo válido
      if (user.pushToken && Expo.isExpoPushToken(user.pushToken)) {
        pushTokens.push(user.pushToken);
      }
    });

    if (pushTokens.length === 0) {
      console.log('Nenhum token de notificação válido foi encontrado.');
      return null;
    }

    console.log(`Enviando notificação para ${pushTokens.length} dispositivos.`);

    // 2. Criar as mensagens de notificação
    const messages: ExpoPushMessage[] = [];
    for (const pushToken of pushTokens) {
      messages.push({
        to: pushToken,
        sound: 'default',
        title: 'Novo Pet para Adoção! 🐾',
        body: `${petName} está esperando por um lar. Venha conhecer!`,
        data: { petId: petId }, // Envia o ID do pet para o app
      });
    }

    // 3. Enviar as notificações em lotes (chunks) para não sobrecarregar
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    try {
      for (const chunk of chunks) {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log('Lote de notificações enviado:', ticketChunk);
      }
    } catch (error) {
      console.error('Erro ao enviar as notificações push:', error);
    }

    // Você pode adicionar lógica aqui para verificar os 'tickets' e lidar
    // com tokens que não são mais válidos.

    return { success: true, message: 'Notificações enviadas.' };
  });
