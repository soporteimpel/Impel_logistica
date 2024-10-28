import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Perfil from './Perfil';

const Pantala_configuracion = ({ setModalVisiblemenu,navigation,idConductor,placavehiculo,setFiltroDespacho  }) => {
    const [modalperfil,setModalPerfil] = useState(false)
    
    
    const filtrado = (filtro_select)=>{
        setFiltroDespacho(filtro_select);
        setModalVisiblemenu(false)
    }
    return (
        <Pressable
            style={styles.overlay} 
            onPress={() => setModalVisiblemenu(false)}
        >

        
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
            <Pressable onPress={() => setModalVisiblemenu(false)} style={styles.iconContainer}>
                <Icon name="bars" size={30} color="#064973" style={styles.iconoBoton} />
            </Pressable>
            <Text style={styles.title}>Inicio</Text>
            <Pressable 
                onPress={()=> setModalPerfil(true)}
            >
                <Text style={styles.title}>Perfil</Text>
            </Pressable>
            <Pressable 
                onPress={()=> filtrado('')}
            >
                <Text style={styles.title}>Todos</Text>
            </Pressable>

            <Pressable 
                onPress={()=> filtrado('Asignado')}
            >
                <Text style={styles.title}>Asignado</Text>
            </Pressable>

            <Pressable 
                onPress={()=> filtrado('En Transito')}
            >
                <Text style={styles.title}>En Tránsito</Text>
            </Pressable>

            <Pressable 
                onPress={()=> filtrado('Entregado')}
            >
                <Text style={styles.title}>Entregado</Text>
            </Pressable>

            <Pressable 
                onPress={()=> filtrado('Finalizado')}
            >
                <Text style={styles.title}>Finalizado</Text>
            </Pressable>




            {modalperfil&&
                <Modal
                    visible={modalperfil}
                    animationType="slide"
                >
                    <Perfil
                        idConductor={idConductor}
                        placavehiculo={placavehiculo}
                        navigation={navigation}
                        setModalPerfil={setModalPerfil}
                    />

                </Modal>
            
            
            }
        </Pressable>

        </Pressable>

    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente que cubre toda la pantalla
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para que el formulario siga visible
        justifyContent: 'flex-start', // Alinea el contenido al inicio de la pantalla
        alignItems: 'flex-start',
        width: '50%', // Ocupa la mitad de la pantalla (izquierda a derecha)
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        margin: 20,
    },
    iconContainer: {
        padding: 10,
    },
    iconoBoton: {
        alignSelf: 'flex-start',
    },
});

export default Pantala_configuracion;
