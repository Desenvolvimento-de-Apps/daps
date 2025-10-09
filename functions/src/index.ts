import * as functions from 'firebase-functions';
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
    const petId = context.params.petId; // Pega o ID do documento criado
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
      // Adiciona o token se ele existir e for um token Expo válido
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
        data: { petId: petId }, // Envia o ID do pet para o app
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

    // Você pode adicionar lógica aqui para verificar os 'tickets' e lidar
    // com tokens que não são mais válidos.
    console.log('Tickets recebidos:', tickets);

    console.log('Função finalizada com sucesso.');
    return { success: true, message: 'Notificações enviadas.' };
  });
