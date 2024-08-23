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

import { crearRegistro, telefono_validar,obtenerUbicaion } from "../helpers/index_peticiones";
import FotoPQR_creacion_1 from "./Foto1";
import FotoPQR_creacion_2 from "./Foto2";
import FotoPQR_creacion_3 from "./Foto3";
import FotoPQR_creacion_5 from "./Foto5";
import FotoPQR_creacion_6 from "./Foto6";
import Grabacion from "./Grabacion";
import FotoPQR_creacion_4 from "./Foto4";
import Ubicacion from "./Ubicacion";
import Archivos_creados from "./Archivos_creados";
import { useFocusEffect } from "@react-navigation/native";
import CustomAlert from "./CustomAlert";

const Formulario2 = ({ listaActualizar,setlistaActualizar,navigation }) => {
 
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pqrCreada, setpqrCreada] = useState("");
  const [codigo, setcodigo] = useState(0);

  //Estado para boton
  const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
  const [botonDeshabilitadoCrear, setBotonDeshabilitadoCrear] = useState(false);
  //Foto para envio en creacion
  const [foto_1_formulario, setfoto_1_formulario] = useState("");
  const [foto_2_formulario, setfoto_2_formulario] = useState("");
  const [foto_3_formulario, setfoto_3_formulario] = useState("");
  const [foto_4_formulario, setfoto_4_formulario] = useState("");
  const [foto_5_formulario, setfoto_5_formulario] = useState("");
  const [foto_6_formulario, setfoto_6_formulario] = useState("");
  const [animacionboton] = useState(new Animated.Value(1));

  //Audio Guardado en base64
  const [audiobase64, setAudioBase64] = useState("");

  //Locacion 
  const [longitud,setLongitud] = useState("")
  const [latitud,setLatitud] =useState("")
  const [direccion, setDireccion] = useState(null);
  const [location,setLocation] =useState(null)


  //Reestablecer formulario
  const [reestablcer_formulario,serReestablecer_formulario] = useState(false)

  // Control de visibilidad del alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Formulario');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );


  //actualizar detalle
  useEffect(()=>{
    setlistaActualizar(actualizarLista_creado())
  },[])


  //Desabilitar boton al presionar
  const desabilitarboton = async () => {
    setBotonDeshabilitado(true);
  };

  const desabilitarbotonCrear = async () => {
    setBotonDeshabilitadoCrear(true);
  };

  //Estados para reestablecer modulos de fotos
  const [resetFoto1,setResetFoto1] = useState(()=>()=>{})
  const [resetFoto2,setResetFoto2] = useState(()=>()=>{})
  const [resetFoto3,setResetFoto3] = useState(()=>()=>{})
  const [resetFoto4,setResetFoto4] = useState(()=>()=>{})
  const [resetFoto5,setResetFoto5] = useState(()=>()=>{})
  const [resetFoto6,setResetFoto6] = useState(()=>()=>{})

  //funcion reestablecerformulario
  const formulario_restablecido = ()=>{
    setfoto_1_formulario("")
    setfoto_2_formulario("")
    setfoto_3_formulario("")
    setfoto_4_formulario("")
    setfoto_5_formulario("")
    setfoto_6_formulario("")
    setNombre("")
    setTelefono("")
    setcodigo("")
    //Reset a fotos 
    resetFoto1()
    resetFoto2()
    resetFoto3()
    resetFoto4()
    resetFoto5()
    resetFoto6()

  }


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

  const prueba = async () => {
    console.log("boton oprimido");
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
          <View style={styles.campo}>
            
            <TextInput
              style={styles.imput}
              placeholder="Nombre Completo"
              //keyboardType='numeric'
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              style={styles.imput}
              placeholder="Número de Teléfono"
              keyboardType="numeric"
              value={telefono}
              onChangeText={setTelefono}
            />
          </View>
          <View style={styles.foto_contenedor}>
            <FotoPQR_creacion_1 setfoto_1_formulario={setfoto_1_formulario}  setResetFoto1={setResetFoto1}/>
            <FotoPQR_creacion_2 setfoto_2_formulario={setfoto_2_formulario}  setResetFoto2={setResetFoto2}/>
            
          </View>

          <View style={styles.foto_contenedor}>
            <FotoPQR_creacion_3 setfoto_3_formulario={setfoto_3_formulario} setResetFoto3={setResetFoto3}/>
            <FotoPQR_creacion_4 setfoto_4_formulario={setfoto_4_formulario} setResetFoto4={setResetFoto4}/>
          </View>

          <View style={styles.foto_contenedor}>
            <FotoPQR_creacion_5 setfoto_5_formulario={setfoto_5_formulario} setResetFoto5={setResetFoto5}/>
            <FotoPQR_creacion_6 setfoto_6_formulario={setfoto_6_formulario} setResetFoto6={setResetFoto6}/>
          </View>


          <Grabacion setAudioBase64={setAudioBase64} />

          <View style={styles.botoncontanier}>
            <TouchableNativeFeedback
              onPressIn={() => animacionEntrada()}
              onPressOut={() => animacionSalida()}
              onPress={() => {
                obtenerUbicaion(setLatitud,setLongitud,setDireccion,setBotonDeshabilitado,setLocation);
                if (!botonDeshabilitado) {
                  desabilitarboton();
                  telefono_validar(telefono, setBotonDeshabilitado);
                }
              }}
            >
              <Animated.View style={[styles.botonInico, estiloAnimacion]}>
                <Text style={styles.textoboton}>Solicitar Codigo</Text>
              </Animated.View>
            </TouchableNativeFeedback>
          </View>

          <TextInput
            style={styles.imput}
            placeholder="Codigo"
            keyboardType="numeric"
            value={codigo}
            onChangeText={setcodigo}
          />

          <View style={styles.botoncontanier}>
            <TouchableNativeFeedback
              onPressIn={() => animacionEntrada()}
              onPressOut={() => animacionSalida()}
              onPress={() => {
                if (!botonDeshabilitadoCrear) {
                  desabilitarbotonCrear();
                  
                  setlistaActualizar(actualizarLista_creado())
                  crearRegistro(
                    nombre,
                    foto_1_formulario,
                    telefono,
                    codigo,
                    setBotonDeshabilitadoCrear,
                    audiobase64,
                    foto_2_formulario,
                    foto_3_formulario,
                    foto_4_formulario,
                    foto_5_formulario,
                    foto_6_formulario,
                    latitud,
                    longitud,
                    direccion,
                    formulario_restablecido,
                    navigation
                  );
                }
              }}
            >
              <Animated.View style={[styles.botonInico, estiloAnimacion]}>
                <Text style={styles.textoboton}>Crear</Text>
              </Animated.View>
            </TouchableNativeFeedback>
          </View>

          

          <View style={styles.botoncontanier}>
            <TouchableNativeFeedback
              onPressIn={() => animacionEntrada()}
              onPressOut={() => animacionSalida()}
              onPress={() => {
                navigation.navigate('Formulario');
              }}
            >
              <Animated.View style={[styles.botonInico, estiloAnimacion]}>
                <Text style={styles.textoboton}>Cancelar</Text>
              </Animated.View>
            </TouchableNativeFeedback>
          </View>



      
          
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
  botonInico: {
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
  }
});
export default Formulario2;
