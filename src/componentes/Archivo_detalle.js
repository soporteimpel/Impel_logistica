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

  //import globalstylesModal from "../styles/index2"


const Archivo_detalle = ({setmodalDetalle,nombreArchivo,num_Archivo,telefono,estadoArchivo,fechaArchivo}) => {

  return (
      <ScrollView style={styles.scrolltotal}>
        <View style={styles.contenedor}>
        
          
            <Text style={styles.labelGlobal}>Detalle Archivo</Text>
            <Pressable style={styles.boton} onPress={() => {setmodalDetalle(false)}}>
              <Text style={styles.textboton}>Cancelar</Text>
            </Pressable>




          
            <View style={styles.fichadatos}>
                <ScrollView
                  nestedScrollEnabled={true}
                >
                    <Text style={styles.headersenefa}></Text>
                    <Text style={styles.datosstyle}>Archivo N°: {num_Archivo}-{nombreArchivo}</Text> 
                    <Text style={styles.datosstyle}>Estado: {estadoArchivo}</Text>
                    <Text style={styles.datosstyle}>Telefono: {telefono}</Text>
                    <Text style={styles.datosstyle}>Recibido: {fechaArchivo}</Text>
                    <Text style={styles.datosstyle}>Fecha: {fechaArchivo}</Text>
                   

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
