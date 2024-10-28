import React, { useState } from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import globalstylesModal from "../styles/index2";
import FotoPQR_creacion_1 from "./Foto1";
import FotoPQR_creacion_2 from "./Foto2";
import FotoPQR_creacion_3 from "./Foto3";
import FotoPQR_creacion_4 from "./Foto4";
import { crearRegistro_foto } from "../helpers/index_peticiones";
const Documento_cargue = ({id_despacho,setModalcargue,estadodespachodet,navigation,setlistaActualizar,setRefreshing,setmodalDetalle}) => {
    const [tipo_registro,setTipo_registro] = useState('')
    const [foto_1_formulario, setfoto_1_formulario] = useState("");
    const [foto_2_formulario, setfoto_2_formulario] = useState("");
    const [foto_3_formulario, setfoto_3_formulario] = useState("");
    const [foto_4_formulario, setfoto_4_formulario] = useState("");
    const [resetFoto1,setResetFoto1] = useState(()=>()=>{})
    const [resetFoto2,setResetFoto2] = useState(()=>()=>{})
    const [resetFoto3,setResetFoto3] = useState(()=>()=>{})
    const [resetFoto4,setResetFoto4] = useState(()=>()=>{})
    const [animacionboton] = useState(new Animated.Value(1));
    const [botonDeshabilitadoCrear, setBotonDeshabilitadoCrear] = useState(false);


    const desabilitarbotonCrear = async () => {
        setBotonDeshabilitadoCrear(true);
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

        //funcion reestablecerformulario
  const formulario_restablecido = ()=>{
    setfoto_1_formulario("")
    setfoto_2_formulario("")
    setfoto_3_formulario("")
    setfoto_4_formulario("")


    resetFoto1()
    resetFoto2()
    resetFoto3()
    resetFoto4()


  }



  return (
    <View style={styles.contenedor}>
        <Pressable style={styles.boton} onPress={() => {setModalcargue(false)}}>
            <Text style={styles.textboton}>Cancelar</Text>
        </Pressable>
    <Text style={styles.label}>Fotos Despacho</Text>
        <View style={styles.campo}>

        
            <Picker
            selectedValue={tipo_registro}
            onValueChange={(itemValue) => {
                setTipo_registro(itemValue);
                
            }}
            style={styles.imput}
            >
            <Picker.Item label="--Seleccione--" value="" />
            {(estadodespachodet.toLowerCase()=='habilitado para cargue' || estadodespachodet.toLowerCase()=='confirmado')&& <Picker.Item label="Cargue" value="Cargue" />}
            {(estadodespachodet.toLowerCase()=='en transito' || estadodespachodet.toLowerCase() === 'en tránsito')&& <Picker.Item label="Descargue" value="Descargue" />}
            {(estadodespachodet.toLowerCase()=='entregado' || estadodespachodet.toLowerCase()=='cumplido')&&<Picker.Item label="Reporte de Cumplido" value="Reporte de Cumplido" />}
            {(estadodespachodet.toLowerCase()=='finalizado' )&&<Picker.Item label="Entrega Contenedor" value="Entrega Contenedor" />}
            </Picker>
        </View>
        
        <View style={styles.foto_contenedor}>
            <FotoPQR_creacion_1 setfoto_1_formulario={setfoto_1_formulario}  setResetFoto1={setResetFoto1}/>
            <FotoPQR_creacion_2 setfoto_2_formulario={setfoto_2_formulario}  setResetFoto2={setResetFoto2}/>
            
          </View>

          <View style={styles.foto_contenedor}>
            <FotoPQR_creacion_3 setfoto_3_formulario={setfoto_3_formulario} setResetFoto3={setResetFoto3}/>
            <FotoPQR_creacion_4 setfoto_4_formulario={setfoto_4_formulario} setResetFoto4={setResetFoto4}/>
          </View>




          <View style={styles.botoncontanier}>
            <TouchableNativeFeedback
              onPressIn={() => animacionEntrada()}
              onPressOut={() => animacionSalida()}
              onPress={() => {
                //Mostrar alerta de confirmacion 
                console.log("id despacho " + id_despacho)
                Alert.alert(
                  'Confirmación',//titulo
                  `Tipo Registro, ${tipo_registro}. ¿Deseas crear?`,//mensaje
                  [
                    {
                      text: 'Cancelar',
                      onPress: () => console.log('Accion cancelada'),
                      style:'cancel',
                    },
                    {
                      text: 'Confirmar',
                      onPress: ()=>{
                        if (!botonDeshabilitadoCrear) {
                          desabilitarbotonCrear();
                          
                          
                          setTimeout(() => {
                            crearRegistro_foto(
                                setBotonDeshabilitadoCrear,
                                tipo_registro,
                                foto_1_formulario,
                                foto_2_formulario,
                                foto_3_formulario,
                                foto_4_formulario,
                                id_despacho,
                                formulario_restablecido,
                                navigation,
                                setModalcargue,
                                setlistaActualizar,
                                setRefreshing,
                                setmodalDetalle
                            );
                        }, 1000); 
                        }

                      }
                    }
                  ]
                )

              }}
            >
              <Animated.View style={[styles.botonInico, estiloAnimacion]}>
                <Text style={styles.textoboton}>Crear</Text>
              </Animated.View>
            </TouchableNativeFeedback>
          </View>
  </View>
  )
}

const styles = StyleSheet.create({
    contenedor: {
        ...globalstylesModal.contenedor,
        flex: 1,
        backgroundColor: "#D6E8EE",
        alignItems: "center",
        marginBottom:30
      },campo: {
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
      }, boton: {
        marginTop: 10,
        backgroundColor: "#0057A0",
        padding: 10,
        borderRadius: 10,
        width: 200,
      },textboton: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
      },  imput: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        width: 230,
      },foto_contenedor:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:'15%',
        
      },  botoncontanier: {
        marginTop: 5, // Ajusta este valor para mover el botón más abajo
        alignItems: "center",
      },  botonInico: {
        marginTop: "10%",
        backgroundColor: "#fff",
        padding: 10,
        width: 200,
        borderRadius: 10,
        borderWidth:2,
        borderColor:"#0057A0"
      },textoboton: {
        color: "#0057A0",
        fontWeight: "bold",
        //textTransform: "uppercase",
        textAlign: "center",
        //fontSize: 18,
      }
})

export default Documento_cargue