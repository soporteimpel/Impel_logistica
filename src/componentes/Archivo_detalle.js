import React from 'react'
import {
    Text,
    Pressable,
    View,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
    Alert
  } from "react-native";

import moment from 'moment';

const Archivo_detalle = ({setmodalDetalle,nombreArchivo,num_Archivo,telefono,estadoArchivo,fechaArchivo,nombreCliente}) => {

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

  let fechaformateada = fecha_formatear2(fechaArchivo)
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
                    <Text style={styles.datosstyle}>Archivo N°: {num_Archivo}-{nombreArchivo}</Text> 
                    <Text style={styles.datosstyle}>Nombre: {nombreCliente}</Text>
                    <Text style={styles.datosstyle}>Póliza: {num_Archivo}</Text>
                    <Text style={styles.datosstyle}>Estado: {estadoArchivo}</Text>
                    <Text style={styles.datosstyle}>Telefono: {telefono}</Text>
                    <Text style={styles.datosstyle}>Creacion: {fechaformateada}</Text>
                   

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
        borderRadius:10
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
    },
})
export default Archivo_detalle
