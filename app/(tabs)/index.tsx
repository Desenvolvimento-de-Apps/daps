import { db } from "@/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [userData, setUserData] = useState<Record<string, any> | null>(null);

  // Função para adicionar/atualizar dados
  const saveData = async () => {
    try {
      // Cria um documento na coleção 'users' com o ID 'testUser'
      await setDoc(doc(db, "users", "testUser"), {
        name: "Usuário Teste",
        email: "teste@exemplo.com",
        createdAt: new Date(), // Salva a data atual
      });
      Alert.alert("Sucesso", "Dados salvos no Firestore!");
    } catch (error) {
      console.error("Erro ao salvar dados: ", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  // Função para ler dados
  const readData = async () => {
    try {
      const docRef = doc(db, "users", "testUser");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Dados do documento:", docSnap.data());
        setUserData(docSnap.data()); // Armazena os dados no estado
        Alert.alert("Sucesso", "Dados lidos do Firestore!");
      } else {
        console.log("Nenhum documento encontrado!");
        Alert.alert(
          "Aviso",
          "Nenhum documento encontrado com o ID 'testUser'."
        );
      }
    } catch (error) {
      console.error("Erro ao ler dados: ", error);
      Alert.alert("Erro", "Não foi possível ler os dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integração Expo + Firebase</Text>

      <View style={styles.buttonContainer}>
        <Button title="Salvar Dados no Firestore" onPress={saveData} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Ler Dados do Firestore" onPress={readData} />
      </View>

      {userData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Nome: {userData.name}</Text>
          <Text style={styles.dataText}>Email: {userData.email}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: "80%",
  },
  dataContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  dataText: {
    fontSize: 16,
  },
});
