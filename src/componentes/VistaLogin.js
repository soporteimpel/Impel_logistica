import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Image,Pressable,Animated,TouchableNativeFeedback,ScrollView } from 'react-native';
import { Icon, Button,CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerEstadoSession } from '../helpers/index_peticiones';
import { useNavigation } from '@react-navigation/native';
import Svg, {Path}  from 'react-native-svg';


const VistaLogin = ({setisLoggedIn}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberPassword, setRememberPassword] = useState(false);
    const navigation = useNavigation()
    
    const titulo_cehck = "Recordar contraseña"
    const [animacionboton] = useState(new Animated.Value(1));

    const animacionEntrada = () => {
      Animated.spring(animacionboton, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
    };
  
    const animacionSalida = () => {
      Animated.spring(animacionboton, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3, //mayor el numero menor el rebote
        tension: 100, //entre meyor el numero mas sueve el movimiento
      }).start();
    };
  
    const estiloAnimacion = {
      transform: [{ scale: animacionboton }],
    };



  useEffect(() => {
    // Recuperar datos del usuario almacenados al cargar el componente
    const retrieveUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData_francomer');
        //console.log('Stored User Data:', storedUserData);
        if (storedUserData) {
          const { username, password, rememberPassword } = JSON.parse(storedUserData);
          setUsername(username);
          setPassword(password);
          setRememberPassword(rememberPassword);
        }
      } catch (error) {
        console.error('Error al recuperar datos del usuario:', error);
      }
    };

    retrieveUserData();
  }, []); // Se ejecutará solo una vez al montar el componente

  const actualizarLista_creado= () => {
    //generar numero aleatorio
    let numeroAletorio = Math.floor(Math.random() * 90000) + 10000;
    //convertirlo a cinco digitos

    //console.log("numero aleatorio ", numeroAletorio);
    return numeroAletorio;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberPassword = () => {
    setRememberPassword(!rememberPassword);
  };

  const saveUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('currentUserData_francomer', JSON.stringify(userData));
        //console.log('Stored User Data:', userData);
    } catch (error) {
        console.error('Error al almacenar datos del usuario actual:', error);
    }
};

  const handleLogin = async () => {
    console.log('el boton login se esta presionando ');
    try {
      //Almacenar datos en el storage para las peticiones que se van a realizar para el usuario
      console.log('sin error ')
      const currentUserData = {username, password}
      await saveUserData(currentUserData)
      // Llama a la función para verificar el usuario
      const userData = await obtenerEstadoSession(username, password);

      if (userData==="ok") {
        // Usuario válido, navega a la vista DatosImpel

        const toggleRememberPassword = () => {
          setRememberPassword(!rememberPassword);
        };
        setisLoggedIn(true); // Puedes pasar datos del usuario si es necesario
        
        // Almacena los datos del usuario en AsyncStorage si se marca la casilla "Recordar contraseña"
        if (rememberPassword) {
          const userDataToStore = { username, password, rememberPassword };
          const userDataString = JSON.stringify(userDataToStore);
          await AsyncStorage.setItem('userData_francomer', userDataString);
          //console.log('Stored User Data:', userDataToStore);
        }
      } else {
        // Usuario no válido, muestra un mensaje de error
        Alert.alert('Error', 'Usuario y clave incorrecta');
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
    }
  };
  return (
    <ScrollView>
    <View style={styles.container}>
      
      <Image source={require('../../assets/Log_MiiA_modulo.png')} style={styles.imagen}/>
      <Svg
          height="110"
          width="100%"
          viewBox="0 0 1440 360"
          style={styles.wave}
        >
          <Path
            fill="#ff2301" // Color del fondo ondulado
            d="M0,160
       C480,320 960,0 1440,160
       L1440,320
       L0,320
       Z"
          />
        </Svg>
      <View style={styles.container2}>
      
      <Text style={styles.title}>Bienvenido</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            type="material-community"
            size={24}
          />
        </TouchableOpacity>
        
      </View>
      <View style={styles.buttonContainer}>


        <TouchableNativeFeedback
          onPressIn={() => animacionEntrada()}
          onPressOut={() => animacionSalida()}
          onPress={()=>{handleLogin()}}
        >
          <Animated.View style={[styles.botonLogin, estiloAnimacion]}>
                <Text style={styles.textoboton}>Acceder</Text>
          </Animated.View>

        </TouchableNativeFeedback>


        <View style={styles.checkboxContainer}>
          <CheckBox
            //title={titulo_cehck}
            checked={rememberPassword}
            onPress={toggleRememberPassword}
            checkedColor='#fff'
            
          />
          <Text style={styles.recordarclave}>{titulo_cehck}</Text>
        </View>
      </View>

      </View>
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor:'#fff',
    flexDirection:'column'
    
  },container2: {
    backgroundColor:"#ff2301",
    width:'100%',
    alignItems: 'center',
    height:'100%',
    marginTop:-25 

  },
  title: {
    fontSize: 24,
    marginTop:20,
    marginBottom: 20,
    fontWeight:'bold',
    width:'80%',
    color:'#fff'
    
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor:'#fff'
  },
  passwordInputContainer: {
    width: '80%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor:'#fff'
  },
  passwordInput: {
    flex: 1,
  }, checkboxContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-sart',
    marginBottom: 2,
    
    
  },
  imagen:{
    marginTop:'20%',
    marginBottom:'10%',
    width:170,
    height:170
  },wave: {
    
    top: 0,
    left: 0,
    right: 0,
  },recordarclave:{
    fontWeight:'bold',
    color:'#fff'

  },botonLogin: {
    marginTop: "10%",
    backgroundColor: "#fff",
    padding: 10,
    width: 200,
    borderRadius: 10,
    borderWidth:2,
    borderColor:"#ff2301"
  },
  textoboton: {
    color: "#ff2301",
    fontWeight: "bold",
    //textTransform: "uppercase",
    textAlign: "center",
    //fontSize: 18,
  }
});

export default VistaLogin
