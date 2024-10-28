
import React,{useState} from 'react';
import { StyleSheet,SafeAreaView,StatusBar} from 'react-native';
import Formulario from './src/componentes/Formulario';
import Formulario2 from './src/componentes/Formulario2';
import Formulario_asistncia from './src/componentes/Formulario_asistncia';
import VistaLogin from './src/componentes/VistaLogin';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Pantala_configuracion from './src/componentes/Pantala_configuracion';
import Perfil from './src/componentes/Perfil';
import Documento_cargue from './src/componentes/Documento_cargue';

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

            <Stack.Screen
              name='Formulario_asistncia'
              options={{ headerShown: false }}
            >
              {(props) => (
                  <Formulario_asistncia
                    {...props}
                    listaActualizar={listaActualizar}
                    setlistaActualizar={setlistaActualizar}
                  />
                )}


            </Stack.Screen>

            <Stack.Screen
              name='Configuracion' // Nombre que usarás para navegar a esta pantalla
              options={{ headerShown: false }} // Ocultar el encabezado si es necesario
            >
              {(props) => (
                  <Pantala_configuracion
                    {...props}
                    listaActualizar={listaActualizar}
                    setlistaActualizar={setlistaActualizar}
                  />
                )}
            </Stack.Screen>

            <Stack.Screen
              name='Perfil' // Nombre que usarás para navegar a esta pantalla
              options={{ headerShown: false }} // Ocultar el encabezado si es necesario
            >
              {(props) => (
                  <Perfil
                    {...props}
                    listaActualizar={listaActualizar}
                    setlistaActualizar={setlistaActualizar}
                  />
                )}
            </Stack.Screen>

            <Stack.Screen
              name='Documento_cargue' // Nombre que usarás para navegar a esta pantalla
              options={{ headerShown: false }} // Ocultar el encabezado si es necesario
            >
              {(props) => (
                  <Documento_cargue
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









