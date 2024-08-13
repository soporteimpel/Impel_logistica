import React, {useState,useEffect} from 'react'
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
  } from "react-native";
  import * as Location from 'expo-location';
const Ubicacion = ({setLatitud,setLongitud,setDireccion}) => {

  //Estados de ubicacion
  const [location,setLocation] =useState(null)
  const [errorMsg,setErrorMsg] = useState(null)
 
    //pedir permisos ubicacion 
    useEffect(()=>{
        (async()=>{
            let {status} = await Location.requestForegroundPermissionsAsync()
            if(status !== 'granted'){
            setErrorMsg('Permiso de localizacion denegado')
            return

            }

        })()
        },[])

        //obtener ubicacion
        const obtenerUbicaion = async () => {
            try {
                let ubicacion_real = await Location.getCurrentPositionAsync({})
                setLocation(ubicacion_real)
                setLatitud(ubicacion_real.coords.latitude)
                setLongitud(ubicacion_real.coords.longitude)
                      // Obtener dirección usando Google Maps API
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ubicacion_real.coords.latitude},${ubicacion_real.coords.longitude}&key=AIzaSyBlfazo5fIoHIYeMdsYEiVA_MitG7OvMOQ`
                );
                const data = await response.json();
                //console.log("direccion " + JSON.stringify(data, null, 2))
                //console.log("direccion formateada " + data.results[0].formatted_address)
                if (data.results.length > 0) {
                    let ubicacionformat = data.results[0].formatted_address
                    console.log("Longitud " + ubicacionformat)
                    ubicacionformat = encodeURIComponent(ubicacionformat)    
                                  
                    setDireccion(ubicacionformat);
                } else {
                    setDireccion('Dirección no encontrada');
                }


            } catch (error) {
                Alert.alert("Error", "No se pudo obtener la ubicación.");
            }

        }

  return (
    <Pressable style={styles.boton} onPress={obtenerUbicaion}>
        <Text style={styles.textoboton}>Localización: {location ? `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}` : 'Sin datos'}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    boton: {
        marginTop: 10,
        backgroundColor: "#064973",
        padding: 10,
        borderRadius: 10,
        width: 200,
      },  textboton: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
      }
})
export default Ubicacion
