import React,{useState,useEffect} from 'react'
import {
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
    View,
    Modal
  } from "react-native";
  import globalstyles from '../styles';
  import { archivosList } from '../helpers/index_peticiones';
  import Archivo_detalle from './Archivo_detalle';
  //import DetallePqr from "./DetallePqr";
const Archivos_creados = ({listaActualizar}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalDetalle,setmodalDetalle] = useState(false)
    const [num_Archivo,setnum_Archivo] = useState('')
    const [nombreArchivo,setNombreArchivo] = useState('')
    const [estadoArchivo,setestadoArchivo] = useState('')
    const [telefono,setTelefono] = useState('')
    const [fechaArchivo,setfechaArchivo] = useState('')

  
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await archivosList();
          setData(response);
        } catch (error) {
          console.log("Error al obtener los datos:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [listaActualizar,modalDetalle]);
  
    return (
      <View style={styles.contenedor}>
        <ScrollView>
          {loading ? (
            <Text>Cargando...</Text>
          ) : (
            data.map((item, index) => (
              <Pressable
                key={index}
                style={styles.boton}
                onPress={() => {
                  console.log(item[0])
                  setmodalDetalle(true)
                  setNombreArchivo(item[1])
                  setnum_Archivo(item[2])
                  setTelefono(item[3])
                  setestadoArchivo(item[4])
                  setfechaArchivo(item[5])

  
                  
                }}
              >
                <Text style={styles.contenedorLista}>Sec {item[2]}. {item[1]}</Text>
              </Pressable>
            ))
          )}
  
          {modalDetalle &&
            <Modal
              animationType='slide'
              visible={modalDetalle}
            
            >
              
              <Archivo_detalle
                setmodalDetalle={setmodalDetalle}
                nombreArchivo={nombreArchivo}
                num_Archivo={num_Archivo}
                telefono={telefono}
                estadoArchivo={estadoArchivo}
                fechaArchivo={fechaArchivo}

              />
              
            </Modal>
          
          
          }
  
          
  
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    contenedor: {
      ...globalstyles.contenedor,
      transform: [{ translateY: 0 }],
      width: "60%",
      flex:1,
      marginTop:10,
      marginBottom:20
      
    },
    contenedorLista: {
      backgroundColor: "#ff2301",
      padding: 10,
      marginBottom: '3%',
      borderRadius: 10,
      color: "#fff",
      fontWeight: "bold",
    },
  });
export default Archivos_creados
