import { StatusBar } from 'expo-status-bar';
import React,{useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Formulario from './src/componentes/Formulario';
export default function App() {
  const [listaActualizar,setlistaActualizar] = useState(0)
  return (
    <View style={styles.container}>
      <Formulario
        setlistaActualizar={setlistaActualizar}
        listaActualizar={listaActualizar}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
});


