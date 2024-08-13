import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Alert, Pressable,Animated,Easing } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
const Grabacion = ({setAudioBase64}) => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sonido_animacion] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesitan permisos para usar el micrófono');
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      console.log('Iniciando grabación...');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({
        shouldDuckAndroid: true,
        //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);

      //Inicar Animacion 
      animateBars();

    } catch (err) {
      console.error('Error al iniciar la grabación', err);
    }
  };

  const stopRecording = async () => {
    console.log('Deteniendo grabación...');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    console.log('Grabación guardada en:', uri);
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    console.log("el base 64 es " + base64);
    setAudioBase64(base64);

    //Detener la animacion de sonido
    stopBarsAnimation();
  };

  const animateBars = () => {
    sonido_animacion.forEach(bar => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: Math.random(),
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: Math.random(),
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        ])
      ).start();
    });
  };

  const stopBarsAnimation = () => {
    sonido_animacion.forEach(bar => {
      bar.stopAnimation();
      bar.setValue(0);
    });
  };




  const playSound = async () => {
    if (!recordingUri) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri: recordingUri },
      { shouldPlay: true }
    );
    setSound(sound);

    await sound.playAsync();
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  const resetRecording = () => {
    setRecordingUri(null);
    setAudioBase64("");
  };



  return (
    <View style={styles.container}>
      
      <Pressable
        style={styles.botonGrabacion}
        
        onPress={recording ? stopRecording : startRecording}
      >
        {recording ? <Text style={styles.textboton}>Detener Grabación</Text> : <Text style={styles.textboton}>Iniciar Grabación</Text>}

      </Pressable>
      {recording && (
        <View style={styles.visualizer}>
          {sonido_animacion.map((bar, index) => (
            <Animated.View key={index} style={[styles.bar, { height: bar.interpolate({ inputRange: [0, 1], outputRange: [10, 100] }) }]} />
          ))}
        </View>
      )}
      {recordingUri && (
        <View style={styles.audioControls}>
          <Pressable style={styles.botonReproductor} onPress={playSound}>
            <Text style={styles.textboton2}>Reproducir Audio</Text> 
          </Pressable>
          <Pressable style={styles.botonReproductor} onPress={stopSound}>
            <Text style={styles.textboton2}>Detener Audio</Text> 
          </Pressable>
          <Pressable style={styles.botonReproductor} onPress={resetRecording}>
            <Text style={styles.textboton2}>Eliminar Grabación</Text> 
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  audioControls: {
    marginTop: 20,
  },botonGrabacion:{
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: 200,
    borderWidth:2,
    borderColor:"#ff2301"
    
  },botonReproductor:{
    marginTop: 5,
    backgroundColor: "#ff2301",
    padding: 10,
    borderRadius: 10,
    width: 200,
    borderWidth:2,
    borderColor:"#fff"
    
  },textboton2: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },textboton: {
    textAlign: "center",
    color: "#ff2301",
    fontWeight: "bold",
  },visualizer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '60%',
  },bar: {
    width: 10,
    backgroundColor: '#ff2301',
    borderRadius: 5,
  }
});

export default Grabacion;
