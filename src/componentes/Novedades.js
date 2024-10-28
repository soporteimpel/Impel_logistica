import React, { useState } from 'react'
import { Text,StyleSheet,View,Pressable} from 'react-native'
import globalstylesModal from '../styles/index2'
import { TextInput } from 'react-native-paper'
import { enviar_novedad } from '../helpers/index_peticiones'

const Novedades = ({setModalNovedad,id_despacho}) => {
    const [text,setText] = useState('')
  return (
    <View style={styles.contenedor}>
        <Pressable style={styles.boton} onPress={() => setModalNovedad(false)}>
            <Text style={styles.textboton}>Cancelar</Text>
        </Pressable>
        <TextInput
            label='Novedad'
            placeholder='Novedad'
            value={text}
            multiline={true}
            cursorColor='#0057A0'
            activeUnderlineColor='#0057A0'
            //backgroundColor='#66B1E3'
            style={styles.imput}
            onChangeText={text=>setText(text)}
        />

        <Pressable style={styles.botonEnviar} onPress={() => enviar_novedad(text,id_despacho,setModalNovedad)}>
            <Text style={styles.textboton}>Enviar</Text>
        </Pressable>
    </View>
    
  )
}


const styles = StyleSheet.create({
    contenedor: {
        ...globalstylesModal.contenedor,
        flex: 1,
        backgroundColor: "#D6E8EE",
        alignItems: "center",
        marginBottom:30,
        
        },
    boton: {
        marginTop: 10,
        backgroundColor: "#0057A0",
        padding: 10,
        borderRadius: 10,
        width: 200,
      },textboton: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
      },imput:{
        marginTop:'10%',
        width:'80%',
        backgroundColor: 'transparent',
        
      },botonEnviar: {
        marginTop: 10,
        backgroundColor: "#0057A0",
        padding: 10,
        borderRadius: 10,
        width: 200,
        position: 'absolute',
        bottom: 50
        
      }
})
export default Novedades