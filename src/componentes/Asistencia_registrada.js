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
  import { asistenciaList } from '../helpers/index_peticiones';
  import moment from 'moment';
  import Asistencia_detalle from './Asistencia_detalle';

const Asistencia_registrada = ({listaActualizar}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalDetalle,setmodalDetalle] = useState(false);
    const [creador,setCreador] = useState("");
    const [tipoAsistencia,setTipoAsistencia] = useState("");
    const [aistenciaId,setAsistenciaId] = useState(0);
    const [aistenciaName,setAsistenciaName] = useState("");
    const [fechaAsistencia,setFechaAsistencia] = useState("");
    const [urlfoto,setUrlfoto]  = useState("");
    useEffect(() => {
        async function fetchData() {
        try {
            const response = await asistenciaList();
            setData(response);
        } catch (error) {
            console.log("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, [listaActualizar,modalDetalle]);


    const fecha_formatear2 = (fecha) => {
        try {
            if (!fecha) {
                console.log("Fecha del archivo es null o undefined");
                return "Fecha no disponible";
            }
    
            const date = moment(fecha);
            if (!date.isValid()) {
                console.error("Fecha inválida");
                return "Fecha inválida";
            }
    
            return date.format('DD/MM/YYYY HH:mm');
        } catch (error) {
            console.error("Error formateando fecha:", error);
            return "Fecha inválida";
        }
    }

    
  return (
    <View style={styles.contenedor}>
         <ScrollView 
          nestedScrollEnabled={true}
        >
        {loading ? (
            <Text>Cargando...</Text>
        ):(
            data.map((item,index)=>(
                <Pressable
                    key={index}
                    style={styles.boton}
                    onPress={()=>{
                        setAsistenciaId(item[0]);
                        setCreador(item[1]);
                        setTipoAsistencia(item[2]);
                        setAsistenciaName(item[3]);
                        setFechaAsistencia(item[4]);
                        setUrlfoto(item[5]);
                        setmodalDetalle(true)

                        
                    }}

                >
                    <Text style={styles.contenedorLista}>{item[3]}-{fecha_formatear2(item[4])}</Text>
                </Pressable>
            ))
        )
    }

        {modalDetalle &&
            <Modal
                animationType='slide'
                visible={modalDetalle}
            >
                <Asistencia_detalle
                    setmodalDetalle={setmodalDetalle}
                    aistenciaName={aistenciaName}
                    aistenciaId={aistenciaId}
                    creador={creador}
                    tipoAsistencia={tipoAsistencia}
                    fechaAsistencia={fechaAsistencia}
                    urlfoto={urlfoto}

                />

            </Modal>
        
        
        }

        </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
    contenedor: {
      ...globalstyles.contenedor,
      transform: [{ translateY: 0 }],
      width: "80%",
      height:300,
      flex:1,
      marginTop:10,
      marginBottom:20
      
    },
    contenedorLista: {
      backgroundColor: "#f5f5f5",
      padding: 10,
      marginBottom: '3%',
      borderRadius: 10,
      color: "#000",
      fontWeight: "bold",
    },
  });

export default Asistencia_registrada
