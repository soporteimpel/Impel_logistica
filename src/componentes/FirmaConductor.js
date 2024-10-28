import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Modal, StyleSheet, Image, Text,Pressable} from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { enviarfirmaBase64conductor,datosConductor_firma_huella } from '../helpers/index_peticiones';


const FirmaConductor = ({ onSignatureCapture, onSignatureClear,idConductor }) => {
  const sigCanvasRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState("");
  const [firmado, setFirmado] = useState(false);
  const [dataurl,setDataurl] =useState([]);

  const startSigning = () => setModalVisible(true);

  useEffect(()=>{
    async function urlsconductor() {
      try {
        var response = await datosConductor_firma_huella(idConductor)
        setDataurl(response)
        if (response ) {
          console.log("asignando la firma " + response[0][0])
          setSignature(response[0][0]); // Si es base64 o una URL válida
        }
      } catch (error) {
        console.log("No fue posible las url" + error)
      }
    }
    urlsconductor()
  },[idConductor])

  const handleSendSignature = async (dataURL) => {
    try {
      const firma = await enviarfirmaBase64conductor(dataURL,idConductor);
      console.log("Firma enviada:", firma);
      setFirmado(true);
      setModalVisible(false);
      onSignatureCapture && onSignatureCapture(dataURL);
    } catch (error) {
      console.error('Error al enviar la firma en Base64:', error);
    }
  };

  const handleSignature = (dataURL) => {
    if (dataURL) {
      setSignature(dataURL);
      console.log("Firma capturada:", dataURL);
      handleSendSignature(dataURL);
    } else {
      console.log('Firma vacía');
    }
  };

  const clearSignature = () => {
    sigCanvasRef.current.clearSignature();
    setFirmado(false);
    setSignature("");
    onSignatureClear && onSignatureClear();
  };

  const confirmSignature = async () => {
    try {
      const dataURL = await sigCanvasRef.current.readSignature();
      handleSignature(dataURL);
    } catch (error) {
      console.error('Error al confirmar la firma:', error);
    }
  };
  console.log("la firma es " + signature)
  return (
    <View style={{ flex: 1, alignItems:'center' }}>
      

      <Pressable style={styles.boton} onPress={startSigning}>
        <Text style={styles.textboton}>{firmado ? "Firmado" : "Comenzar a Firmar"}</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Firma aquí</Text>
            <SignatureCanvas
              ref={sigCanvasRef}
              onOK={handleSignature}
              descriptionText=""
              clearText="Borrar"
              confirmText="Confirmar"
              webStyle={style.signatureCanvas}
            />
            <View style={styles.buttonContainer}>
              <Button title="Borrar" onPress={clearSignature} />
              <Button title="Confirmar" onPress={confirmSignature} />
            </View>
          </View>
        </View>
      </Modal>

      {signature && typeof signature === 'string' && (
        <View style={styles.firmacontenedor}>
          <Text>Firma:</Text>
          <Image source={{uri: signature}} style={{ width: 150, height: 150 }} />
        </View>
      )}

      
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 300,
    height: 400,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },boton: {
    marginTop: 10,
    backgroundColor: "#ffff",
    borderColor:"#0057A0",
    borderWidth:1,
    padding: 10,
    borderRadius: 10,
    width: "90%",
  },textboton: {
    textAlign: "center",
    color: "#0057A0",
    fontWeight: "bold",
  },firmacontenedor:{
    alignItems:'center'
  }
});

const style = StyleSheet.create({
  signatureCanvas: {
    width: 250,
    height: 150,
    borderColor: '#000',
    borderWidth: 1,
  }
});

export default FirmaConductor;
