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
const Archivos_creados = ({listaActualizar,setPlacaVechiculo,filtroDepacho,navigation,setlistaActualizar}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); 
    const [modalDetalle,setmodalDetalle] = useState(false)

    const [nombreCliente,setNombreCliente] = useState('')

    //nuevos estados para la app logistica 
    const [id_despacho,setId_despacho] = useState("")
    const [estado,setEstado] = useState("")
    const [despachoName,setDespachoName] = useState("")
    const [placa,setPlaca] = useState("")
    const [fechaManifiesto,setFechaManifiesto] = useState("")
    const [numero_manifiesto,setNumero_manifiesto]=useState("")
    const [origen,setOrigen]=useState("")
    const [direccion_origen,setDireccion_origen] = useState("")
    const [destino,setDestino] = useState("")
    const [direccion_destino,setDireccion_destino] = useState("")
    const [fecha_cargue,setFecha_cargue] = useState("")
    const [link_inventario,setLink_inventario] = useState("")

    //Estados contenedor 
    const [fechaRcogida, setFechaRcogida] = useState("")
    const [lugarRecogida, setLugarRecogida] = useState("")
    const [fechaDevolucion, setFechaDevolucion] = useState("")
    const [lugarDevolucion, setLugarDevolucion] = useState("")

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await archivosList();
          console.log("datos obtenidos " + response.length);
          
          setData(response);
          setFilteredData(response)
        } catch (error) {
          console.log("Error al obtener los datos:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [listaActualizar,modalDetalle]);

    useEffect(() => {
      if (filtroDepacho && typeof filtroDepacho === 'string') {
        const estadoNormalizado = filtroDepacho
          .normalize ? filtroDepacho.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : filtroDepacho;
    
        if (estadoNormalizado.toLowerCase() === 'en transito') {
          // Filtra los registros con el estado 'En Tránsito'
          const datosFiltrados = data.filter((item) => {
            if (item[4] && typeof item[4] === 'string') {
              const estadoItem = item[4]
                .normalize ? item[4].normalize('NFD').replace(/[\u0300-\u036f]/g, '') : item[4];
    
              return estadoItem.toLowerCase() === 'en transito';
            }
            return false;
          });
    
          setFilteredData(datosFiltrados);
    
        } else if (estadoNormalizado.toLowerCase() === 'finalizado') {
          // Filtra los registros con estado 'Cumplido', 'Finalizado' o 'Finalizado Contenedor Devuelto'
          const datosFiltrados = data.filter((item) => {
            if (item[4] && typeof item[4] === 'string') {
              const estadoItem = item[4]
                .normalize ? item[4].normalize('NFD').replace(/[\u0300-\u036f]/g, '') : item[4];
    
              // Verifica si el estado es uno de los valores deseados
              return ['cumplido', 'finalizado', 'finalizado contenedor devuelto'].includes(estadoItem.toLowerCase());
            }
            return false;
          });
    
          setFilteredData(datosFiltrados);
    
        }else if (estadoNormalizado.toLowerCase() === 'asignado') {
          // Filtra los registros con estado 'Cumplido', 'Finalizado' o 'Finalizado Contenedor Devuelto'
          const datosFiltrados = data.filter((item) => {
            if (item[4] && typeof item[4] === 'string') {
              const estadoItem = item[4]
                .normalize ? item[4].normalize('NFD').replace(/[\u0300-\u036f]/g, '') : item[4];
              console.log('filtrando estado ' + estadoItem.toLowerCase())
              // Verifica si el estado es uno de los valores deseados
              return ['habilitado para cargue','confirmado sin inspeccion','asignado','confirmado','asignado sin inventario'].includes(estadoItem.toLowerCase());
            }
            return false;
          });
    
          setFilteredData(datosFiltrados);
    
        } else if (estadoNormalizado.toLowerCase() === 'entregado') {
          // Filtra los registros con estado 'Cumplido', 'Finalizado' o 'Finalizado Contenedor Devuelto'
          const datosFiltrados = data.filter((item) => {
            if (item[4] && typeof item[4] === 'string') {
              const estadoItem = item[4]
                .normalize ? item[4].normalize('NFD').replace(/[\u0300-\u036f]/g, '') : item[4];
    
              // Verifica si el estado es uno de los valores deseados
              return ['entregado','cumplido'].includes(estadoItem.toLowerCase());
            }
            return false;
          });
    
          setFilteredData(datosFiltrados);
    
        } else {
          // Si no es 'En Tránsito' ni 'Finalizado', muestra todos los datos
          setFilteredData(data);
        }
      } else {
        // Si no hay filtro, muestra todos los datos
        setFilteredData(data);
      }
    }, [filtroDepacho, data,listaActualizar]);
    
    

    //console.log("Filter data tiene " + filteredData[0][0])
  
    return (
      <View style={styles.contenedor}>
        <ScrollView 
          nestedScrollEnabled={true}
        >
          {loading ? (
            <Text>Cargando...</Text>
          ) : (
            
            
            filteredData.map((item, index) => (
              
              <Pressable
                key={index}
                style={styles.boton}
                onPress={() => {
                  console.log("id despacho " + item[0])
                  setmodalDetalle(true)
                  setId_despacho(item[0])
                  setEstado(item[4])
                  setDespachoName(item[1])
                  setPlaca(item[3])
                  setPlacaVechiculo(item[3])
                  setFechaManifiesto(item[7])
                  setNumero_manifiesto(item[8])
                  setOrigen(item[9])
                  setDireccion_origen(item[10])
                  setDestino(item[11])
                  setDireccion_destino(item[12])
                  setFecha_cargue(item[13])
                  setLink_inventario(item[14])
                  setFechaRcogida(item[15])
                  setLugarRecogida(item[16])
                  setFechaDevolucion(item[17])
                  setLugarDevolucion(item[18])
  
                  
                }}
              >
                <Text style={styles.contenedorLista}> 
                  Estado: <Text style={styles.contenedorLista_valor}>{item[4]}</Text>{"\n"} 
                  Despacho: <Text style={styles.contenedorLista_valor}>{item[1]}</Text>{"\n"} 
                  Placa: <Text style={styles.contenedorLista_valor}>{item[3]}</Text> 
                  
                </Text>
                <Text style={styles.fecha}>{item[5]}</Text>
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
                estado={estado}
                despachoName={despachoName}
                placa={placa}
                fechaManifiesto={fechaManifiesto}
                numero_manifiesto={numero_manifiesto}
                origen={origen}
                direccion_origen={direccion_origen}
                destino={destino}
                direccion_destino={direccion_destino}
                fecha_cargue={fecha_cargue}
                link_inventario={link_inventario}
                id_despacho={id_despacho}
                navigation={navigation}
                setlistaActualizar={setlistaActualizar}
                listaActualizar={listaActualizar}
                lugarRecogida={lugarRecogida}
                fechaRcogida={fechaRcogida}
                lugarDevolucion={lugarDevolucion}
                fechaDevolucion={fechaDevolucion}
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
      width: "90%",
      height:"50",
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
    },   fecha: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      fontSize: 12,
      color: "#888",
    },contenedorLista_valor: {
      backgroundColor: "#f5f5f5",
      padding: 10,
      marginBottom: '3%',
      borderRadius: 10,
      color: "#000",
      fontWeight: "400",
    }
  });
export default Archivos_creados
