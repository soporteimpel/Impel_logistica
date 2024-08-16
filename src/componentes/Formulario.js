import React, { useState,useEffect,useCallback} from "react";
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  TouchableNativeFeedback,
  Animated,
  Image,
  BackHandler
} from "react-native";

import { datosUsuario } from "../helpers/index_peticiones";

import Archivos_creados from "./Archivos_creados";
import { useFocusEffect } from "@react-navigation/native";
import CustomAlert from "./CustomAlert";

const Formulario = ({setlistaActualizar,listaActualizar,navigation,setisLoggedIn,setModal }) => {

  const [animacionboton] = useState(new Animated.Value(1));




  //Reestablecer formulario
  const [reestablcer_formulario,serReestablecer_formulario] = useState(false)

  // Control de visibilidad del alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setIsAlertVisible(true);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );


  //actualizar detalle
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await datosUsuario();
        setData(response);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };
    setlistaActualizar(actualizarLista_creado())
    fetchData();
  },[])







  //funcion cita creada

  const creandoPQR = (estado) => {
    if (estado == "ok") {
      Alert.alert("PQR Creada", "Tu PQR fue creada con exito");
    }
  };
  const actualizarLista_creado= () => {
    //generar numero aleatorio
    let numeroAletorio = Math.floor(Math.random() * 90000) + 10000;
    //convertirlo a cinco digitos

    console.log("numero aleatorio ", numeroAletorio);
    return numeroAletorio;
  };



    // Funciones para el manejo del modal
    const handleCloseAlert = () => {
      setIsAlertVisible(false);
    };
  
    const handleConfirmAlert = () => {
      // Aquí puedes manejar la lógica para cerrar sesión o cualquier otra acción
      setIsAlertVisible(false);
      setisLoggedIn(false); // Suponiendo que tienes este estado para controlar la sesión
      
    };



  return (
    <View style={styles.contenedor}>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.items}>
          <Image source={require('../../assets/Log_MiiA_modulo.png')} style={styles.imagen}/>
         {data && data.length > 0 && (
            <View style={styles.datoslogin}>
                <Text style={styles.datosText}>{data[0][1]}</Text>
                <Text style={styles.datosText2}>{data[0][2]}</Text>
                <Text style={styles.datosText2}>{data[0][3]}</Text>
              </View>


         )}





          <Archivos_creados
            listaActualizar={listaActualizar}
          />
          
        </View>


        <View style={styles.contenedorboton}>
        <Pressable style={styles.botonLogin} onPress={() => {
            navigation.navigate('Formulario2')
          }}

          
          
          >
          <Text style={styles.textoboton}>Crear</Text>
        </Pressable>

      </View>
      </ScrollView>

      
      <CustomAlert
        isVisible={isAlertVisible}
        onClose={handleCloseAlert}
        onConfirm={handleConfirmAlert}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'stretch',
    width: "100%",
    borderRadius: 10,
    
  },
  boton: {
    marginTop: 10,
    backgroundColor: "#064973",
    padding: 10,
    borderRadius: 10,
    width: 200,
  },
  botonSeleccione: {
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    padding: 10,
    width: 230,
    alignContent: "center",
  },
  items: {
    alignItems: "center",
    width: "100%",
  },
  textboton: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  textbotonSelect: {
    textAlign: "center",
    color: "#000000",
    fontWeight: "bold",
  },
  labelGlobal: {
    textAlign: "center",
    fontSize: 25,
  },
  campo: {
    marginTop: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  label: {
    color: "#000000",
    marginBottom: 10,
    marginTop: 15,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  imput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 230,
    borderColor:'#e0e0e0',
    borderWidth:2
  },
  imputArea: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 230,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 5,
  },
  labelDescripcion: {
    color: "#000000",
    marginBottom: 10,
    marginTop: 15,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  botoncontanier: {
    marginTop: 5, // Ajusta este valor para mover el botón más abajo
    alignItems: "center",
  },
  botonLogin: {
    marginTop: "10%",
    backgroundColor: "#ff2301",
    padding: 10,
    width: 200,
    borderRadius: 10,
    borderWidth:2,
    borderColor:"#ff2301"
  },
  textoboton: {
    color: "#fff",
    fontWeight: "bold",
    //textTransform: "uppercase",
    textAlign: "center",
    //fontSize: 18,
  },
  scrollViewContent: {
    flexGrow: 1,

    //alignItems: "center",
    //padding: 10,
  },foto_contenedor:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginHorizontal:'15%',
    
  },imagen:{
    marginTop:30,
    width:150,
    height:150
  },datoslogin:{
    width:'100%',
    marginLeft:'20%',
    marginBottom:'10%',
    marginTop:'10%',
    
  },datosText:{
    fontSize:20,
    fontWeight:'bold'
  },datosText2:{
    fontSize:16,
    fontWeight:'bold',
    color:'#dddddd'
  },contenedorboton:{
    width:'100%',
    marginVertical:"5%",
    marginBottom:'10%',
    alignItems:'center'
    
  }
});
export default Formulario;
