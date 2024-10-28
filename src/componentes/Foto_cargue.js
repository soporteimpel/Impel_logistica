import React, { useEffect, useState } from 'react';
import { View, Button, Image, StyleSheet, Pressable,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import * as ImageManipulator from 'expo-image-manipulator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { link_inventario_despacho,enviarhuellaBase64conductor } from '../helpers/index_peticiones';

const Foto_cargue = ({id_despacho}) => {
    const [photo, setPhoto] = useState(null);
    const [id, setId] = useState(null);
    const [dataurl,setDataurl] =useState([]);
    const [urlImagen,setUrlimagen] = useState("")
    const [photoTaken, setPhotoTaken] = useState(false); 

    useEffect(()=>{
        async function urlsconductor() {
          try {
            var response = await link_inventario_despacho(id_despacho)
            setDataurl(response)
            if (response ) {
              console.log("asignando la huella " + response[0][1])
              setUrlimagen(response[0][1]); // Si es base64 o una URL válida
            }
          } catch (error) {
            console.log("No fue posible las url" + error)
          }
        }
        urlsconductor()
      },[id_despacho,photoTaken])
  
  
  
    const enviarImagen = async (uri) => {
      try {
          console.log('Id ', id)
          console.log('uri ', uri)
        if (!uri) {
          throw new Error('El id o la foto deben estar definidos.');
        }
  
        // Obtén las dimensiones originales de la imagen
        const { width: originalWidth, height: originalHeight } = await getImageDimensions(uri);
        // Calcula las nuevas dimensiones manteniendo las proporciones
        const newWidth = 1000;
        const newHeight = (originalHeight / originalWidth) * newWidth;
  
        // Comprimir la imagen antes de convertirla en base64
        const compressedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: newWidth, height: newHeight } }],
          { format: 'png', compress: 0.5 }
        );
  
        const base64Image = await encodeImageToBase64(compressedImage.uri);
        enviar_foto_cargue(base64Image,id_despacho)
        if (!base64Image) {
          throw new Error('La conversión de imagen a base64 falló.');
        }
        setPhotoTaken(true); 
  
      } catch (error) {
        console.error('Error al enviar la imagen:', error.message);
      }
    };
  
    const encodeImageToBase64 = async (uri) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error al convertir la imagen a base64:', error.message);
        throw error;
      }
    };
  
    const openImagePicker = async (sourceType) => {
      let result;
      if (sourceType === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permiso de cámara no otorgado');
          return;
        }
  
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permiso de galería no otorgado');
          return;
        }
  
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
      }
  
      if (!result.cancelled) {
        const selectedImage = result.assets[0];
        setPhoto({ uri: selectedImage.uri });
  
        // Llama a enviarImagen inmediatamente después de seleccionar la imagen
        enviarImagen(selectedImage.uri);
      }
    };
  
  
      //obtener dimensiones originales de la imagen 
      const getImageDimensions = async (uri) => {
        return new Promise((resolve, reject) => {
            Image.getSize(
                uri,
                (width, height) => {
                    resolve({ width, height });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    };
  return (
    <View style={styles.container}>
        
       
    {/* <Button title="Tomar Foto" onPress={openImagePicker} />  boton original */}
    <View style={styles.buttonContainer}>
        <Pressable style={styles.boton} onPress={()=>openImagePicker('camera')}>
            {((urlImagen && urlImagen !== '')) ? (
              <Image source={{ uri: photo ? photo.uri : urlImagen }} style={styles.image} />
            ) : (
              <Icon name='image' size={50} color="#cfd9ec" style={styles.placeholderIcon}/>
            )}
        </Pressable>
        {false &&(
          <Pressable style={styles.boton_select_image} onPress={()=>openImagePicker('gallery')}>
            <Icon name="add-photo-alternate" size={20} color="#fff" />
          </Pressable>

        )}
        
        
    </View>
    <Text style={styles.texto}> Foto 1</Text>

  </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },buttonContainer: {
      flexDirection: 'row',  // Coloca los botones en fila
      alignItems: 'center',  // Alinea verticalmente
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 10,
      marginVertical: 20,
      alignSelf: 'center',
    },boton: {
      marginTop: 10,
      backgroundColor: "#eff2f9",
      padding: 2,
      borderRadius: 10,
      width:200,
      height:200,
      justifyContent:'center',
      position:'relative'
  
    },boton_select_image: {
      marginTop: 10,
      backgroundColor: "#ff2301",
      padding: 10,
      borderRadius: 10,
      marginLeft:1,
      width: 40,
      position:'absolute',
      bottom:-10,
      right:-10
    },botonText:{
      color:'#fff',
      textAlign:'center',
      fontWeight:'bold'
    }, placeholderIcon: {
      alignSelf: 'center',
    },texto:{
      marginTop:20,
      fontWeight:'500'
    }
  });
export default Foto_cargue