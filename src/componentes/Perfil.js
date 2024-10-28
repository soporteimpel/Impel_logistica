import React,{useState,useEffect} from 'react'
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
    Image
  } from "react-native";
import { datosConductor } from '../helpers/index_peticiones';
import FirmaConductor from './FirmaConductor';
import Foto_huella_conductor from './Foto_huella_conductor';


const Perfil = ({navigation,idConductor,setModalPerfil}) => {
const [datos,setDatos] = useState([]);
const [loading, setLoading] = useState(true);

const enviar_a_link = async()=>{
  const urlimpel = "https://www.impeltechnology.com/"
  await Linking.openURL(urlimpel)
}


useEffect(()=>{
    const fetchDatosConductor = async () => {
        try {
          const respuesta = await datosConductor(idConductor); 
          setDatos(respuesta);
        } catch (error) {
          console.error("Error al obtener los datos del conductor:", error);
        }finally{
            setLoading(false);
        }
      };
    
      fetchDatosConductor();

},[idConductor])




  return (
    <ScrollView style={styles.scrolltotal}>
        <View style={styles.contenedor}>
        
          
            
            <Pressable style={styles.boton} onPress={() => setModalPerfil(false)}>
              <Text style={styles.textboton}>Volver</Text>
            </Pressable>




          
            <View style={styles.fichadatos}>
                <ScrollView
                  nestedScrollEnabled={true}
                >
                 
                        <Text style={styles.headersenefa}></Text>

                        {loading ? (
                            <Text>Cargando...</Text>
                        ):(
                            <Text style={styles.datosstyle}>
                                Nombre: <Text style={styles.contenedorLista_valor}>{datos[0][0] || 'N/A'}</Text>{"\n"} 
                                Documento: <Text style={styles.contenedorLista_valor}>{datos[0][3] || 'N/A'}</Text>{"\n"} 
                                Placa: <Text style={styles.contenedorLista_valor}>{datos[0][7] || 'N/A'}</Text> {"\n"} 
                                Asignado: <Text style={styles.contenedorLista_valor}>{datos[0][4] || 'N/A'}</Text> {"\n"}
                                Transito: <Text style={styles.contenedorLista_valor}>{datos[0][5] || 'N/A'}</Text> {"\n"}
                                Cumplido: <Text style={styles.contenedorLista_valor}>{datos[0][6] || 'N/A'}</Text> 
                            </Text> 

                        )}
  
          
        

                </ScrollView>

            </View>

            <View style={styles.fichafoto}>

              <FirmaConductor
                idConductor={idConductor}
              />

            </View>

            <View style={styles.fichafoto}>

            <Foto_huella_conductor
              idConductor={idConductor}
            />

            </View>



            <View style={styles.fichadatospie}>
               <Image source={require('../../assets/impel_log_new.png' )} style={styles.imagen}/>
                <Text style={styles.datosstylePie}>
                  IMPEL TI SAS        
                </Text>
                <Pressable onPress={enviar_a_link}>
                    <Text style={[styles.datosstylePie,{color:'#0057A0'}]}>
                        https://www.impeltechnology.com/
                    </Text>
                </Pressable>
                <Text style={styles.datosstylePie}>
                  Todos los derechos reservados.       
                </Text>
                
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
        paddingBottom:'100%',
        
        
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
        height:'20%',
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
        marginVertical:10

      },botonText:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold'
    },contenedorBoton:{
        alignItems:'center',
        marginBottom:20
    },contenedorLista_valor: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        marginBottom: '3%',
        borderRadius: 10,
        color: "#000",
        fontWeight: "400",
      },fichadatosFirma:{
        marginTop:10,
        backgroundColor:'#fff',
        width:'90%',
        height:'20%',
        borderRadius:10
      },fichafoto:{
        marginTop:10,
        backgroundColor:'#fff',
        borderColor:"#cccccc",
        borderWidth:3,
        width:'90%',
        height:'30%',
        borderRadius:10
      },datosstylePie:{
        backgroundColor:'#ffff',
        padding:5,
        borderRadius:15,
        fontWeight:'500',
        paddingHorizontal:10,
        marginHorizontal:10,
        marginVertical:1,
        

      },fichadatospie:{
        marginTop:30,
        backgroundColor:'#fff',
        width:'90%',
        height:'30%',
        borderRadius:10,
        alignItems:'center'
      },imagen:{
        marginTop:'1%',
        marginBottom:'1%',
        width:150,
        height:150
      }
})
export default Perfil
