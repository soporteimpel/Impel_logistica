
import React,{useState} from 'react';
import { StyleSheet, Text, View,SafeAreaView,StatusBar,Modal} from 'react-native';
import Formulario from './src/componentes/Formulario';
import Formulario2 from './src/componentes/Formulario2';
import VistaLogin from './src/componentes/VistaLogin';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

export default function App() {
  const [listaActualizar,setlistaActualizar] = useState(0)
  const [isLoggedIn,setisLoggedIn] = useState(false)
  const [modal,setModal] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#0000"}/>
      <NavigationContainer>
        <Stack.Navigator>
          {!isLoggedIn ? (
            <Stack.Screen
              name='Login'
              options={{headerShown: false}}
            >
              {(props)=> <VistaLogin {...props} setisLoggedIn={setisLoggedIn}/>}
              
            </Stack.Screen>
          ) : (
            <>
            <Stack.Screen
              name='Formulario'
              options={{headerShown:false}}

            >
             {(props) => (
              <Formulario
                {...props}
                setlistaActualizar={setlistaActualizar}
                listaActualizar={listaActualizar}
                setisLoggedIn={setisLoggedIn}
                setModal={setModal}
              />
            )}
              

            </Stack.Screen>
            <Stack.Screen
              name='Formulario2'
              options={{ headerShown: false }}
            >
              {(props) => (
                  <Formulario2
                    {...props}
                    listaActualizar={listaActualizar}
                    setlistaActualizar={setlistaActualizar}
                  />
                )}


            </Stack.Screen>

          </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    
  },
});


