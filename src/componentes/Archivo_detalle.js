import React, { useState,useEffect,useCallback } from 'react'
import {
    Text,
    Pressable,
    View,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
    Alert,
    Linking,
    RefreshControl
  } from "react-native";

import moment from 'moment';
import Documento_cargue from './Documento_cargue';
import { FAB} from 'react-native-paper';
import Novedades from './Novedades';
import { lista_fotos_despacho,despacho_informacion,lista_novedades } from '../helpers/index_peticiones';
import Prueba_despacho_det from './Prueba_despacho_det';



const Archivo_detalle = ({setmodalDetalle,estado,despachoName,placa,fechaManifiesto,numero_manifiesto,origen,direccion_origen,destino,direccion_destino,fecha_cargue,
  link_inventario,id_despacho,navigation,setlistaActualizar,listaActualizar,lugarRecogida,fechaRcogida,lugarDevolucion,fechaDevolucion}) => {
  const [modalcargue,setModalcargue] = useState(false)
  const [modalNovedad,setModalNovedad] = useState(false)
  const [datafoto,setDataFoto] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadinginfo, setLoadinginfo] = useState(true)
  const [loadingnovedades, setLoadingnovedades] = useState(true)
  const [datadetalle,setDatadetalle] = useState([])
  //Estado para recargar componente 
  const [refreshing, setRefreshing] = useState(false)
  const [nombredespachodet,setNombredespachodet] = useState('')
  const [estadodespachodet,setEstadodespachodet] = useState('')
  const [ulrmanifiesto,setUlrmanifiesto] =useState('')
  const [ordenServicio, setOrdenServicio] = useState('')
  const [ulrRemesa1,setUlrRemea1] =useState('')
  const [ulrRemesa2,setUlrRemea2] =useState('')
  const [ulrRemesa3,setUlrRemea3] =useState('')
  const [ulrRemesa4,setUlrRemea4] =useState('')

  //Estado para la consulta de la novedad 
  const [data_novedad,setData_novedad] = useState([])

  //Estados Despacho Detalle
  const [modalPruebaDespacho, setModalPruebaDespacho] = useState("")
  const [tipo_prueba, setTipo_prueba] = useState("")
  const [fecha_prueba, setFecha_prueba] = useState("")
  const [foto_prueba1, setFoto_prueba1] = useState("")
  const [foto_prueba2, setFoto_prueba2] = useState("")
  const [foto_prueba3, setFoto_prueba3] = useState("")
  const [foto_prueba4, setFoto_prueba4] = useState("")
  const [idprueba1, setIdprueba1] = useState("")
  const [tipocontenedor,setTipocontenedor] = useState('') // si tipo de contenedor es 57584347 se muestra boton para registrar entrega de contendor 
  const refresh = useCallback(async ()=>{
    setRefreshing(true)
    try {
      console.log("refrescando")
      
      setlistaActualizar(actualizarLista_creado())
      //setmodalDetalle(false)
    } catch (error) {
      console.error("Error al refrescar los datos:", error);
    }finally{
      setRefreshing(false)
    }
    

  },[])


  const actualizarLista_creado= () => {
    //generar numero aleatorio
    let numeroAletorio = Math.floor(Math.random() * 90000) + 10000;
    //convertirlo a cinco digitos

    console.log("numero aleatorio ", numeroAletorio);
    return numeroAletorio;
  };

  useEffect(()=>{
    async function pruebas_despacho () {
      try {
        const response = await lista_fotos_despacho(id_despacho) 
        setDataFoto(response)
        
      } catch (error) {
        console.log("Error al obtener las pruebas de despacho " + error)
      }finally {
        setLoading(false);
      }
      
      
    }
    pruebas_despacho()

  },[setModalNovedad,setModalcargue,listaActualizar])

//actualiza las novedades 
  useEffect(()=>{
    async function novedades_creadas () {
      try {
        const response = await lista_novedades(id_despacho) 
        setData_novedad(response)
        console.log('novedades creadas con ' + response);
      } catch (error) {
        console.log("Error al obtener las pruebas de novedades " + error)
      }finally {
        setLoadingnovedades(false);
      }
      
      
    }
    novedades_creadas()

  },[setModalNovedad,setModalcargue,listaActualizar])

  useEffect(()=>{
    async function informacion_despacho () {
      try {
        const response2 = await despacho_informacion(id_despacho) 
        setDatadetalle(response2)
        
      } catch (error) {
        console.log("Error al obtener la informacion de despacho " + error)
      }finally {
        setLoadinginfo(false);
      }
      
      
    }
    informacion_despacho()

  },[setModalNovedad,setModalcargue,listaActualizar])

  useEffect(() => {
    if (datadetalle.length > 0 && datadetalle[0].length > 4) {
      setEstadodespachodet(datadetalle[0][4]);
      setTipocontenedor(parseInt(datadetalle[0][15]))
      setUlrmanifiesto(datadetalle[0][16])
      setOrdenServicio(datadetalle[0][17])
      setUlrRemea1(datadetalle[0][18])
      setUlrRemea2(datadetalle[0][19])
      setUlrRemea3(datadetalle[0][20])
      setUlrRemea4(datadetalle[0][21])
      console.log('el tipo de contenedor es ' + datadetalle[0][15])
    }
  }, [datadetalle]);


  const fecha_formatear = async(fecha)=>{
    try {
      if (fecha === null || fecha === undefined) {
        console.log("Fecha del archivo es null o undefined");
        return "Fecha no disponible";
      }
      let date = new Date(fecha)
      console.log("fecha del archivo " + date)
      if(isNaN(date.getTime())){
        console.error("Fecha inválida");
              return "Fecha inválida";
    
      }
      const year = date.getFullYear()
      console.log(year)
      const month= String(date.getMonth() + 1).padStart(2,'0')
      const day  = String(date.getDate()).padStart(2,'0')
      const hours= String(date.getHours()).padStart(2,'0')
      const minutess= String(date.getMinutes()).padStart(2,'0')
      
    
      let formattfecha = `${year}-${month}-${day} ${hours}:${minutess}`
      return formattfecha
      
    } catch (error) {
      return "Fecha invalidad"
    }
    
  
  
  }

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


const enviar_a_link = async()=>{
  const urlimpel = link_inventario
  await Linking.openURL(urlimpel)
}

const enviar_a_link_docuentos = async(url)=>{
  let urlimpel = url ? url : '';
  console.log('la url del documento a ver es ' + urlimpel)
  if(urlimpel || urlimpel!==''){
    await Linking.openURL(urlimpel)
  }else{
    Alert.alert("Error", "El documento no existe");
  }
  
}

  let fecha_manifiesto_format = fecha_formatear2(fechaManifiesto)
  let fecha_cargue_format     = fecha_formatear2(fecha_cargue)
  

  return (
    <>
      <ScrollView style={styles.scrolltotal}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={refresh}/>
                }
      
      >
        <View style={styles.contenedor}>
        
          
            
            <Pressable style={styles.boton} onPress={() => {setmodalDetalle(false)}}>
              <Text style={styles.textboton}>Cancelar</Text>
            </Pressable>




          
            <View style={styles.fichadatos}>
            {loadinginfo ? (
                    <Text>Cargando...</Text>
                  ) : (
                <ScrollView
                  nestedScrollEnabled={true}
                >
                 
                    <Text style={styles.headersenefa}></Text>
                    <Text style={styles.datosstyle_header}>{datadetalle[0][1]}</Text> 
                    <Text style={styles.datosstyle}>No. Manifiesto: {numero_manifiesto}</Text>
                    <Text style={styles.datosstyle}>Fecha Manifiesto: {fecha_manifiesto_format}</Text>
                    <Text style={styles.datosstyle}>Origen: {origen}</Text>
                    <Text style={styles.datosstyle}>Dirección origen: {direccion_origen}</Text>
                    <Text style={styles.datosstyle}>Destino: {destino}</Text>
                    <Text style={styles.datosstyle}>Dirección destino: {direccion_destino}</Text>
                    <Text style={styles.datosstyle}>Fecha de cargue: {fecha_cargue_format}</Text>
                    <Text style={styles.datosstyle_header}>Estado: {datadetalle[0][4]}</Text>
                    {tipocontenedor == 57584347 &&
                        <View>
                        <Text style={styles.datosstyle_header}>Datos Contenedor</Text>
                        <Text style={styles.datosstyle}>Fecha de Recogida: {fechaRcogida}</Text>
                        <Text style={styles.datosstyle}>Lugar de Recogida: {lugarRecogida}</Text>
                        <Text style={styles.datosstyle}>Fecha de Devolución: {fechaDevolucion}</Text>
                        <Text style={styles.datosstyle}>Ludar de Devolución: {lugarDevolucion}</Text>
                          
                        </View>
                    }


                    <Pressable >
                      <Text style={styles.datosstyle_link} onPress={()=>enviar_a_link_docuentos(ulrmanifiesto)}>
                        Manifiesto
                      </Text>
                    </Pressable>

                    <Pressable >
                      <Text style={styles.datosstyle_link} onPress={()=>enviar_a_link_docuentos(ordenServicio)}>
                        Orden de Servicio
                      </Text>
                    </Pressable>

                    <Pressable >
                      <Text style={styles.datosstyle_link} onPress={()=>enviar_a_link_docuentos(ulrRemesa1)}>
                        Remesa 1
                      </Text>
                    </Pressable>

                    <Pressable >
                      <Text style={styles.datosstyle_link} onPress={()=>enviar_a_link_docuentos(ulrRemesa2)}>
                        Remesa 2
                      </Text>
                    </Pressable>

                    <Pressable >
                      <Text style={styles.datosstyle_link} onPress={()=>enviar_a_link_docuentos(ulrRemesa3)}>
                        Remesa 3
                      </Text>
                    </Pressable>

                    <Pressable >
                      <Text style={styles.datosstyle_link} onPress={()=>enviar_a_link_docuentos(ulrRemesa4)}>
                        Remesa 4
                      </Text>
                    </Pressable>
                   
                
                </ScrollView>
              )}
            </View>
            
            

            {(estadodespachodet.toLowerCase()=='confirmado sin inspección' || estadodespachodet.toLowerCase()=='asignado sin inventario')&&
              <Pressable onPress={enviar_a_link}>
                <Text style={styles.datosstyle_link}>
                  Link Inventario Vehículo
                </Text>
              </Pressable>
            
            }

            

   

            {modalcargue && (
              <Modal
                animationType='slide'
                visible={modalcargue}
              >
                <Documento_cargue
                  id_despacho={id_despacho}
                  setModalcargue={setModalcargue}
                  estadodespachodet={estadodespachodet}
                  navigation={navigation}
                  setlistaActualizar={setlistaActualizar}
                  setRefreshing={setRefreshing}
                  setmodalDetalle={setmodalDetalle}
                />

              </Modal>
            )}

            


        
        </View>
        {loading ? (
                <Text>Cargando...</Text>
              ) : (
                <View style={styles.contenedor2}>
                <View style={styles.fichadatos_fotos}>
                <ScrollView
                  nestedScrollEnabled={true}
                >
                  <Text style={styles.datosstyle_header}>Pruebas Despacho:</Text> 
                  {Array.isArray(datafoto) && datafoto.length > 0 ? (
                    datafoto.map((item, index) => (
                      <Pressable onPress={()=>{
                      setModalPruebaDespacho(true)
                      setIdprueba1(item[0])
                      setTipo_prueba(item[1])
                      setFecha_prueba(item[2])
                      setFoto_prueba1(item[3])
                      setFoto_prueba2(item[4])
                      setFoto_prueba3(item[5])
                      setFoto_prueba4(item[6])
                      
                      }}>
                        <View key={index} style={styles.itemContainer}>
                          <Text style={styles.datosstyle_fotos}>Tipo: {item[1]} Creado en: {fecha_formatear2(item[2])}</Text>
                        </View>
                      </Pressable>

                    ))
                  ) : (
                    <Text>No hay datos disponibles</Text>
                  )}
                  </ScrollView>
                </View>
                </View>
              )}

            {Array.isArray(data_novedad) && data_novedad.length > 0 && (
              loadingnovedades ? (
                <Text>Cargando...</Text>
              ) : (
                <View style={styles.contenedor2}>
                  <View style={styles.fichadatos_fotos}>
                    <ScrollView nestedScrollEnabled={true}>
                      <Text style={styles.datosstyle_header}>Novedades:</Text>
                      {data_novedad.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                          <Text style={styles.datosstyle_fotos}>Comentario: {item[0]} </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )
            )}
              





              
        </ScrollView>


        
        {(estadodespachodet.toLowerCase() === 'habilitado para cargue' || estadodespachodet.toLowerCase() === 'en transito' || estadodespachodet.toLowerCase() === 'confirmado' || estadodespachodet.toLowerCase() === 'en tránsito' || estadodespachodet.toLowerCase() === 'entregado' || estadodespachodet.toLowerCase() === 'cumplido' || (tipocontenedor == 57584347 && estadodespachodet.toLowerCase() === 'finalizado'))&& 
        <FAB
                icon={"camera"}
                color='#fff'
                backgroundColor='#4A9BD5'
                style={[styles.fab, { bottom: 80 }]} // Ajusta el valor de bottom para colocar el FAB más arriba
                //label='Foto'
                onPress={() => {setModalcargue(true); setlistaActualizar(2);}}
            />
        }

        <FAB
              icon={"exclamation"}
              color='#fff'
              backgroundColor='#D54A4A'
              style={styles.fab}
              //label='Novedad'
              onPress={()=>setModalNovedad(true)}
            />


            {modalNovedad && (
              <Modal
                animationType='slide'
                visible={modalNovedad}
              >
                <Novedades
                  id_despacho={id_despacho}
                  setModalNovedad={setModalNovedad}
                  estado={estado}
                  navigation={navigation}
                  setlistaActualizar={setlistaActualizar}
                />

              </Modal>
            )}
            {modalPruebaDespacho&&(
              <Modal
                animationType='slide'
                visible={modalPruebaDespacho}
              >
                <Prueba_despacho_det
                  setModalPruebaDespacho={setModalPruebaDespacho}
                  tipo_prueba={tipo_prueba}
                  fecha_prueba={fecha_prueba}
                  foto_prueba1={foto_prueba1}
                  foto_prueba2={foto_prueba2}
                  foto_prueba3={foto_prueba3}
                  foto_prueba4={foto_prueba4}
                  idprueba1={idprueba1}
                />

              </Modal>
            )}
        </>
  )
}

const styles=StyleSheet.create({

    contenedor:{
      flex:1,
        //...globalstylesModal.contenedor,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        //marginBottom:'20%',
        paddingBottom:'10%',
        
        
    },contenedor2:{
      flex:2,
        //...globalstylesModal.contenedor,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        //marginBottom:'20%',
        paddingBottom:'10%',
        height:300
        
        
    },labelGlobal: {
        textAlign: "center",
        fontSize: 25,
    },  boton: {
        marginTop: 10,
        backgroundColor: "#0057A0",
        padding: 10,
        borderRadius: 10,
        width: 200,
      },textboton: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
      },fichadatos:{
        marginTop:30,
        backgroundColor:'#fff',
        width:'90%',
        height:'80%',
        borderRadius:10
      },fichadatosNovedad:{
        marginTop:10,
        backgroundColor:'#fff',
        width:'90%',
        height:'40%',
        borderRadius:10,
        
      },headersenefa:{
        backgroundColor:'#0057A0',
        width:'100%',
        height:30,
        borderTopLeftRadius:10,
        borderTopRightRadius:10
      },datosstyle:{
        backgroundColor:'#f2f2f2',
        padding:5,
        borderRadius:15,
        fontWeight:'500',
        paddingHorizontal:10,
        marginHorizontal:10,
        marginVertical:2

      },datosstyle_header:{
        //backgroundColor:'#f2f2f2',
        padding:5,
        borderRadius:15,
        fontWeight:'bold',
        fontSize:20,
        paddingHorizontal:10,
        marginHorizontal:10,
        marginVertical:10

      },botonText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold'
    },contenedorBoton:{
        alignItems:'center',
        marginBottom:20
    },datosstyle_link:{
      //backgroundColor:'#f2f2f2',
      padding:5,
      borderRadius:15,
      fontWeight:'bold',
      fontSize:20,
      textDecorationLine: 'underline',
      paddingHorizontal:10,
      marginHorizontal:10,
      marginVertical:10,
      color:'#0000EE'

    },fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },fichadatos_fotos:{
      marginTop:5,
      backgroundColor:'#fff',
      width:'90%',
      height:'90%',
      borderRadius:10
    },datosstyle_fotos:{
      backgroundColor:'#f2f2f2',
      padding:5,
      borderRadius:15,
      fontWeight:'500',
      paddingHorizontal:10,
      marginHorizontal:10,
      marginVertical:2

    }
})
export default Archivo_detalle
