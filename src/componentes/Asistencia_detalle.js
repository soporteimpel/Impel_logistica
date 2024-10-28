import React,{useEffect, useState} from 'react'
import {
    Text,
    Pressable,
    View,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
    Alert,
    Image
  } from "react-native";

import moment from 'moment';
import { asesores_asistencia } from '../helpers/index_peticiones';
const Asistencia_detalle = ({setmodalDetalle,aistenciaName,aistenciaId,creador,tipoAsistencia,fechaAsistencia,urlfoto,id_despacho}) => {
    const [imageHeight, setImageHeight] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("id de la aistencia en detalle asistencia es " + aistenciaId);
        async function fetchData() {
        try {
            const response = await asesores_asistencia(aistenciaId);
            setData(response);
        } catch (error) {
            console.log("Error al obtener los datos:", error);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    useEffect(() => {
        // Obtener las dimensiones de la imagen
        if((urlfoto && urlfoto !== '')){
            Image.getSize(urlfoto, (width, height) => {
                const fixedWidth = 250;
                const newHeight = (fixedWidth / width) * height;
                setImageHeight(newHeight);
                
              }, (error) => {
                console.error('Error obteniendo dimensiones de la imagen:', error);
                
              });

        }

      }, []);

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
    
      let fechaformateada = fecha_formatear2(fechaAsistencia)

  return (
    <ScrollView style={styles.scrolltotal}>
    <View style={styles.contenedor}>
    
      
        
        <Pressable style={styles.boton} onPress={() => {setmodalDetalle(false)}}>
          <Text style={styles.textboton}>Cancelar</Text>
        </Pressable>




      
        <View style={styles.fichadatos}>
            <ScrollView
              nestedScrollEnabled={true}
            >
                <Text style={styles.headersenefa}></Text>
                <Text style={styles.datosstyle}>Registro N°: {aistenciaName}</Text> 
                <Text style={styles.datosstyle}>Supervisor: {creador}</Text>
                <Text style={styles.datosstyle}>Tipo: {tipoAsistencia}</Text>
                <Text style={styles.datosstyle}>Fecha: {fechaformateada}</Text>
                <View style={styles.contendorTexto}>
                    <Text style={styles.datosText}>Asesores</Text>
                </View>

                {loading ? (
                        <Text>Cargando...</Text>
                    ):(
                        data.map((item,index)=>(
                            <Pressable
                                key={index}
                            >
                                <Text style={styles.datosstyle}>{item}</Text>

                            </Pressable>

                                
                           
                        ))
                    )
                }



                <View style={styles.contendorImagen}>
                    <Image source={{uri: urlfoto}} style={[styles.imagen, { height: imageHeight }]}/>
                </View>
                

               

            </ScrollView>

        </View>

        
    
    </View>
    </ScrollView>
  )
}
const styles=StyleSheet.create({

    contenedor:{
      flex:1,
        //...globalstylesModal.contenedor,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        //marginBottom:'20%',
        paddingBottom:'140%',
        
        
    },labelGlobal: {
        textAlign: "center",
        fontSize: 25,
    },  boton: {
        marginTop: 10,
        backgroundColor: "#ff2301",
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
        borderRadius:10,
       //alignItems:'center'
      },fichadatosNovedad:{
        marginTop:10,
        backgroundColor:'#fff',
        width:'90%',
        height:'40%',
        borderRadius:10,
        
      },headersenefa:{
        backgroundColor:'#ff2301',
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
        marginVertical:10

      },botonText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold'
    },contenedorBoton:{
        alignItems:'center',
        marginBottom:20
    },imagen:{
        marginTop:30,
        width:250,
        alignContent:'center',
        borderRadius:10
        
    },contendorImagen:{
        alignItems:'center',
        marginBottom:90
    },contenedorLista: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        marginBottom: '3%',
        borderRadius: 10,
        color: "#000",
        fontWeight: "bold",
      },datosText:{
        fontSize:20,
        fontWeight:'bold'
      },contendorTexto:{
        alignItems:'center',
        marginBottom:20
    }
})
export default Asistencia_detalle
