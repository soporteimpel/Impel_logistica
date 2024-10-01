import React, { useState, useEffect, useCallback } from "react";
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
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { asesores_por_supervisor } from "../helpers/index_peticiones";
import Foto_asistencia from "./Foto_asistencia";
import { crearRegistroAsistencia } from "../helpers/index_peticiones";
const Formulario_asistncia = ({listaActualizar,setlistaActualizar,navigation}) => {
  const [tipoInformacion, setTipoInformacion] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  // Para almacenar el string con IDs seleccionados
  const [selectedString, setSelectedString] = useState("");

  const [animacionboton] = useState(new Animated.Value(1));

    //Estado para boton
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);
    const [botonDeshabilitadoCrear, setBotonDeshabilitadoCrear] = useState(false);

  //estados foto 
  const [foto_1_formulario, setfoto_1_formulario] = useState("");
  const [resetFoto1,setResetFoto1] = useState(()=>()=>{});

    //funcion reestablecerformulario
    const formulario_restablecido = ()=>{
        setfoto_1_formulario("")
        //Reset a fotos 
        resetFoto1()

    
      }

        //actualizar detalle
        useEffect(()=>{
            setlistaActualizar(actualizarLista_creado())
        },[])
      //crear numero aleatorio como bandera para actualizar 
      const actualizarLista_creado= () => {
        //generar numero aleatorio
        let numeroAletorio = Math.floor(Math.random() * 90000) + 10000;
        //convertirlo a cinco digitos
    
        console.log("numero aleatorio ", numeroAletorio);
        return numeroAletorio;
      };


    // Función para manejar la selección/deselección de asesores
    const handlePress = (item) => {
        console.log("Se agrega a la lista " + item);
        if (selectedItems.includes(item)) {
            
            // Si ya está seleccionado, lo removemos
            const updatedItems = selectedItems.filter((i) => i !== item);
            setSelectedItems(updatedItems);
            // Actualizar el string de seleccionados
            setSelectedString(updatedItems.join(","));
        } else {
            // Si no está seleccionado, lo agregamos
            const updatedItems = [...selectedItems, item];
            setSelectedItems(updatedItems);
            // Actualizar el string de seleccionados
            setSelectedString(updatedItems.join(","));
        }
        console.log("lista de id " + selectedString);
        };


  useEffect(() => {
    
    async function fetchData() {
    try {
        const response = await asesores_por_supervisor();
        setData(response);
    } catch (error) {
        console.log("Error al obtener los datos:", error);
    } finally {
        setLoading(false);
    }
    }
    fetchData();
}, []);

  //Desabilitar boton al presionar
  const desabilitarboton = async () => {
    setBotonDeshabilitado(true);
  };

  const desabilitarbotonCrear = async () => {
    setBotonDeshabilitadoCrear(true);
  };



//Funcionas ara animacion de boton 
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


  return (
    <View style={styles.contenedor}>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.items}>
          <Image
            source={require("../../assets/Log_MiiA_modulo.png")}
            style={styles.imagen}
          />

          <View style={styles.campo}>
            <Text style={styles.label}>Tipo de Asistencia</Text>
            <Picker
              selectedValue={tipoInformacion}
              onValueChange={(itemValue) => {
                setTipoInformacion(itemValue);
                //{console.log(itemValue)}
              }}
              style={styles.imput}
            >
              <Picker.Item label="--Seleccione--" value="" />
              <Picker.Item label="Entrada" value="Entrada" />
              <Picker.Item label="Salida" value="Salida" />
            </Picker>
          </View>

          <View style={styles.foto_contenedor}>
            <Foto_asistencia setfoto_1_formulario={setfoto_1_formulario}  setResetFoto1={setResetFoto1}/>
  
            
          </View>

          <View style={styles.contendorTexto}>
                <Text style={styles.datosText}>Asesores</Text>
          </View>

                {loading ? (
                        <Text>Cargando...</Text>
                    ):(
                        data.map((item,index)=>(
                            <Pressable
                                key={index}
                                style={
                                    styles.lista_datos
                                }
                                  onPress={() => handlePress(item[1])} // Manejar la selección al presionar
                                >
                                <Text style={[
                                    styles.datosstyle,
                                    {
                                      backgroundColor: selectedItems.includes(item[1])
                                        ? "#ff2301" // Color verde si está seleccionado
                                        : "#f2f2f2", // Color original si no está seleccionado
                                    },
                                  ]}>{item[0]}</Text>

                            </Pressable>

                                
                           
                        ))
                    )
                }




            <View style={styles.botoncontanier}>
            <TouchableNativeFeedback
              onPressIn={() => animacionEntrada()}
              onPressOut={() => animacionSalida()}
              onPress={() => {
                if (!botonDeshabilitadoCrear) {
                  desabilitarbotonCrear();
                  
                  setlistaActualizar(actualizarLista_creado())
                  crearRegistroAsistencia(
                    tipoInformacion,
                    foto_1_formulario,
                    selectedString,
                    setBotonDeshabilitadoCrear,
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


            <View style={styles.botoncontanier2}>
                <Pressable
                style={styles.botonInico}
                    onPress={() => {
                        navigation.navigate('Formulario');
                    }}
                >
               
                    <Text style={styles.textoboton}>Cancelar</Text>
              
                </Pressable>
            </View>

        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
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
    borderColor: "#e0e0e0",
    borderWidth: 2,
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
  botoncontanier2: {
    marginTop: 5, // Ajusta este valor para mover el botón más abajo
    alignItems: "center",
    marginBottom: 30,
  },
  botonInico: {
    marginTop: "10%",
    backgroundColor: "#fff",
    padding: 10,
    width: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ff2301",
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
  },
  foto_contenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "15%",
    marginVertical:"20%"
  },
  imagen: {
    marginTop: 30,
    width: 150,
    height: 150,
  },contendorTexto:{
    alignItems:'center',
    marginBottom:20
  },datosstyle:{
    backgroundColor:'#f2f2f2',
    padding:5,
    borderRadius:15,
    fontWeight:'500',
    paddingHorizontal:10,
    marginHorizontal:10,
    marginVertical:10

  },lista_datos:{
    width:"60%",
    marginHorizontal:30,

  }
});
export default Formulario_asistncia;
