import React,{useState} from 'react'
import { ScrollView,View,Text,Pressable,StyleSheet } from 'react-native'
import Foto1_det from './Foto1_det'
import Foto2_det from './Foto2_det'
import Foto3_det from './Foto3_det'
import Foto4_det from './Foto4_det'



const Prueba_despacho_det = ({setModalPruebaDespacho,tipo_prueba,fecha_prueba,foto_prueba1,foto_prueba2,foto_prueba3,foto_prueba4,idprueba1}) => {

    const [fotoformulario, setfotoformulario] = useState("")
    const [fotoformulario2, setfotoformulario2] = useState("")
    const [resetFoto, setResetFoto] = useState("")
    const [resetFoto2, setResetFoto2] = useState("")
  return (
    <ScrollView>
        <View style={styles.contenedor}>
            <Pressable style={styles.boton} onPress={() => {setModalPruebaDespacho(false)}}>
              <Text style={styles.textboton}>Cancelar</Text>
            </Pressable>
        <View style={styles.fichadatos}>
            <Text style={styles.datosstyle_header}>Pruebas Despacho</Text> 
            <Text style={styles.datosstyle}>Tipo: {tipo_prueba}</Text>
            <Text style={styles.datosstyle}>Fecha: {fecha_prueba}</Text>

            <View style={styles.foto_contenedor}>
            <Foto1_det foto_prueba1={foto_prueba1} idprueba1={idprueba1}/>
            <Foto2_det foto_prueba2={foto_prueba2} idprueba1={idprueba1}/>
            </View>
            <View style={styles.foto_contenedor}>
            <Foto3_det foto_prueba3={foto_prueba3} idprueba1={idprueba1}/>
            <Foto4_det foto_prueba4={foto_prueba4} idprueba1={idprueba1}/>
           
            </View>
        </View>

 

        </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    contenedor:{
        flex:1,
          //...globalstylesModal.contenedor,
          backgroundColor: "#f5f5f5",
          alignItems: "center",
          //marginBottom:'20%',
          paddingBottom:'10%',
          height:800
          
          
      },boton: {
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
      },datosstyle_header:{
        //backgroundColor:'#f2f2f2',
        padding:5,
        borderRadius:15,
        fontWeight:'bold',
        fontSize:20,
        paddingHorizontal:10,
        marginHorizontal:10,
        marginVertical:10

      },datosstyle:{
        backgroundColor:'#f2f2f2',
        padding:5,
        borderRadius:15,
        fontWeight:'500',
        paddingHorizontal:10,
        marginHorizontal:10,
        marginVertical:2

      },foto_contenedor:{
        flexDirection:'row',
        justifyContent:'space-between',
        //marginHorizontal:'30%',
        width: '100%',
        
        
      }
});
export default Prueba_despacho_det