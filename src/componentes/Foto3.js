import React, { useEffect, useState } from 'react';
import { View, Button, Image, StyleSheet, Pressable,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import * as ImageManipulator from 'expo-image-manipulator';
import Icon from 'react-native-vector-icons/MaterialIcons';
const FotoPQR_creacion_3 = ({ urlImagen,setfoto_3_formulario }) => {
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState(null);
  




  const enviarImagen = async (uri) => {
    try {
        console.log('Id ', id)
        console.log('uri ', uri)
      if (!uri) {
        throw new Error('El id o la foto deben estar definidos.');
      }

      // Comprimir la imagen antes de convertirla en base64
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }],
        { format: 'jpeg', compress: 0.8 }
      );

      const base64Image = await encodeImageToBase64(compressedImage.uri);
      //console.log("La imagen base 64 es " + base64Image)
      setfoto_3_formulario(base64Image)
      if (!base64Image) {
        throw new Error('La conversión de imagen a base64 falló.');
      }

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


  


  return (
    <View style={styles.container}>
        
       
      {/* <Button title="Tomar Foto" onPress={openImagePicker} />  boton original */}
      <View style={styles.buttonContainer}>
          <Pressable style={styles.boton} onPress={()=>openImagePicker('camera')}>
              {(photo || (urlImagen && urlImagen !== '')) ? (
                <Image source={{ uri: photo ? photo.uri : urlImagen }} style={styles.image} />
              ) : (
                <Icon name='image' size={50} color="#cfd9ec" style={styles.placeholderIcon}/>
              )}
          </Pressable>
          {false&&(
              <Pressable style={styles.boton_select_image} onPress={()=>openImagePicker('gallery')}>
                <Icon name="add-photo-alternate" size={20} color="#fff" />
              </Pressable>

          )}

          
      </View>
      <Text style={styles.texto}>Cédula 1</Text>

    </View>
  );
};

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
    width: 90,
    height: 90,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: 'center',
  },boton: {
    marginTop: 10,
    backgroundColor: "#eff2f9",
    padding: 10,
    borderRadius: 10,
    width: 90,
    height:90,
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
    marginTop:10,
    fontWeight:'500'
  }
});

export default FotoPQR_creacion_3
