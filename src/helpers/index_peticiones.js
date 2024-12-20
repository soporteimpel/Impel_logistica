import axios from "axios"
import { Alert } from "react-native";
import { err } from "react-native-svg";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as Location from 'expo-location';
import { XMLParser } from 'fast-xml-parser'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import queryString from "query-string";
//import AsyncStorage from "@react-native-async-storage/async-storage";
const url = "https://www.impeltechnology.com/rest/api"






//datos de session
//En este componente almacenaremos todas las peticiones a rollbase
// Función para obtener los datos del usuario almacenados en AsyncStorage
const getStoredUserData = async () => {
  try {
      const storedUserData = await AsyncStorage.getItem('currentuserData_impel_logistica');
      if (storedUserData) {
          const { username, password } = JSON.parse(storedUserData);
          return { username, password };
      }
  } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
  }
};

const obtenerUsuarioYContrasena = async () => {
  const userData = await getStoredUserData();
  if (userData) {
      const { username, password } = userData;
      //console.log('Usuario:', username);
      //console.log('Contraseña:', password);
      // Puedes asignar los valores a otras variables si lo necesitas
      return { username, password };
  } else {
      console.log('No se encontraron datos del usuario en AsyncStorage');
      return null;
  }
};

let user = ""
let password = ""
const obtenerDatosUsuario = async () => {
  const { username: username1, password: password2 } = await obtenerUsuarioYContrasena();
  
  user = username1;
  password = password2;

  // Hacer algo con las variables...
};


//token
export const obtenerToken = async()=>{
  try {
      await obtenerDatosUsuario()
      //console.log('usuario ', user, ' password ', password, ' url ', url)
      const response = await axios.post(`${url}/login?loginName=${user}&password=${password}&output=json`)
      //console.log('datos inicio session ', response.data.status)
      return response.data.sessionId

  } catch (error) {
      console.error('Error al obtener los datos de la session ', error)
      throw error
  }
}

export const obtenerEstadoSession = async(username, password)=>{
  try {
      //console.log('usuario ', username, ' password ', password, ' url ', url)
      const response = await axios.post(`${url}/login?loginName=${username}&password=${password}&output=json`)
      console.log('datos inicio session ', response.data.status)
      return response.data.status

  } catch (error) {
      //console.error('Error al obtener estado session ', error)
      Alert.alert('Error','Datos Incorrectos. ')
      throw error
  }
}


//Enviar imagen base 64

export const enviarImagenBase64 = async (id, base64Image,campo) => {
    try {
        
        const token = await obtenerToken()
      const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token}&objName=Archivos`;
  
      // Define el cuerpo de la solicitud en formato XML
      const xmlData = `
       
        <data objName="Archivos" id="${id}" useIds="true">
          <Field name="${campo}">${base64Image}</Field>
        </data>
      `;
  
      const headers = {
        'Content-Type': 'application/xml', // Tipo de contenido XML
      };
  
      // Realiza una solicitud PUT a la URL con los datos en el cuerpo
      //console.log('url envio ', url);
      //console.log('datos del body', xmlData);
      const response = await axios.put(url, xmlData, { headers });
  
      // Retorna la respuesta
      return response.data;
    } catch (error) {
      console.error('Error al enviar la imagen en base64:', error);
      throw error;
    }
  };


//Enviar audio en base 64 
export const enviarAudioBase64 = async (id, base64Audio) => {
  try {
      //console.log("el audio que se intenta enviar es " + base64Audio);
      const token = await obtenerToken()
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token}&objName=Archivos`;

    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Archivos" id="${id}" useIds="true">
        <Field name="Audio_base64">${base64Audio}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar el audio en base64:', error);
    throw error;
  }
};


//Crear Pqr

export const crearRegistro = async(nombre,foto_1_formulario,telefono,codigo,setBotonDeshabilitadoCrear,audiobase64,foto_2_formulario,foto_3_formulario,foto_4_formulario,foto_5_formulario,foto_6_formulario,longitud,latitud,direccion,formulario_restablecido,navigation,num_poliza,tipo_polia_id)=>{
    try {
        //tabla a consultar 
        let tablaPqr= 'Archivos'
        const token6 = await obtenerToken()
        //token6 = "dsgdgghgdshdhr"
        //Primero validar codigo 
        let codigo_aprobado = false
        let codigo_archivo  = false
        //comprobar que el codigo exista junto al telefono en el registro de codigos 
        try {
          
          const tabla_codigos = 'Codigos'
          const consultar_codigo = await axios.post(`${url}/selectQuery`, null, {
            params: {
                sessionId: token6,
                startRow: 0,
                maxRows: 100,
                query: `select id from ${tabla_codigos} WHERE Telefono LIKE '%${telefono}%' AND Codigo=${codigo} ORDER BY id`,
                output: 'json'
            }
        });
          console.log('codigo consultado, cantidad encontrada ' + consultar_codigo.data.length)
          if(consultar_codigo.data.length>0){
            codigo_aprobado = true
          }
        } catch (error) {
          console.log('Error al consultar codigo para crear intente mas tarde',error)
          
        }

        //validar que el codigo ingresado no este en uso en el objeto de archivos 

        try {
          
         
          const consultar_codigo_archivo = await axios.post(`${url}/selectQuery`, null, {
            params: {
                sessionId: token6,
                startRow: 0,
                maxRows: 100,
                query: `select id from ${tablaPqr} WHERE Codigo=${codigo} ORDER BY id`,
                output: 'json'
            }
        });
          console.log('codigo consultado en archivos , cantidad encontrada ' + consultar_codigo_archivo.data.length)
          if(consultar_codigo_archivo.data.length==0){
            codigo_archivo = true
          }
        } catch (error) {
          console.log('Error al consultar codigo en archivos para crear intente mas tarde',error)
          setBotonDeshabilitadoCrear(false)
        }


        
        if(codigo_aprobado!==false && codigo_archivo!==false){
          const crearRgistro= await axios.post(`${url}/createRecord?sessionId=${token6}&output=json&useIds=true&objName=${tablaPqr}&Nombre=${nombre}&Telefono=${telefono}&Codigo=${codigo}&Longitud=${longitud}&Latitud=${latitud}&streetAddr1=${direccion}&No__Poliza=${num_poliza}&R56721585=${tipo_polia_id}`)
          //console.log("Respues creacion ", crearRgistro.data) // +${fechapqr},+${tipopqr},+${mediopqr},+${clienteid} &Fecha_de_Recepcion=${fechapqr}&R52302897=${clienteid}&Tipo_de_Informacion=${tipopqr}&MEDIO_DE_RECEPCIN_Q_R_S_F=${mediopqr}
          //console.log("Respues creacion ", crearRgistro.data) 
          if(crearRgistro.data.status=='ok'){
              formulario_restablecido()
              Alert.alert(
                  'Registro creado',
                  'Gracias. ',
                  [
                      {text:'OK'}
                  ]
                  )
  
          }
          setBotonDeshabilitadoCrear(false)
          let idfoto_creacion = crearRgistro.data.id;
          //console.log("foto 3" + foto_3_formulario);
          const fotosFormulario = {
            foto1: { foto: foto_1_formulario, campo: "foto1_base64" },
            foto2: { foto: foto_2_formulario, campo: "foto2_base64" },
            foto3: { foto: foto_3_formulario, campo: "foto3_base64" },
            foto4: { foto: foto_4_formulario, campo: "foto4_base64" },
            foto5: { foto: foto_5_formulario, campo: "foto5_base64" },
            foto6: { foto: foto_6_formulario, campo: "foto6_base64" }
          };

          for(const key in fotosFormulario){
            if (fotosFormulario.hasOwnProperty(key)) {
              if(fotosFormulario[key].foto!=="" && fotosFormulario[key].foto!==undefined){
                try {
                  await enviarImagenBase64(idfoto_creacion,fotosFormulario[key].foto,fotosFormulario[key].campo)
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "La foto no pudo ser enviada " + fotosFormulario[key],
                    [
                      {text:'OK'}
                    ]
                  )
                }

              }
            }


          }


          //console.log("audio base64 " + audiobase64);
          if(audiobase64!==''){
            try {
              await enviarAudioBase64(idfoto_creacion,audiobase64)
            } catch (error) {
              Alert.alert(
                "Error",
                "El audio no puedo ser enviado ",
                [
                  {text:'OK'}
                ]
              )
            }
              
          }

        }else{
          Alert.alert('Error', 'El codigo ingresado esta errado o ya esta en uso intente de nuevo')
          setBotonDeshabilitadoCrear(false)
          return;
        }

  
        
    } catch (error) {
        console.error('No fue posible crear :', error);
        Alert.alert('Error','No es posible crear, intente mas tarde. ')
        throw error;
    }

    setBotonDeshabilitadoCrear(false)
    navigation.navigate('Formulario')

}

//Validar numero de telefono 

export const telefono_validar = async(telefono,setBotonDeshabilitado)=>{
  try {
      //tabla a consultar 
      let tabla_validar= 'Archivos'
      const token_telefono = await obtenerToken()
      //token6 = "dsgdgghgdshdhr"
      
      
      const telefono_usado= await axios.post(`${url}/selectQuery?sessionId=${token_telefono}&startRow=0&maxRows=100&query=select+id+from+${tabla_validar}+WHERE+Telefono+LIKE+'%25${telefono}%25'+ORDER+BY+id&output=json`)
      //console.log("Respues creacion ", telefono_usado.data.length) // +${fechapqr},+${tipopqr},+${mediopqr},+${clienteid} &Fecha_de_Recepcion=${fechapqr}&R52302897=${clienteid}&Tipo_de_Informacion=${tipopqr}&MEDIO_DE_RECEPCIN_Q_R_S_F=${mediopqr}
      if(telefono_usado.data.length>3){
        Alert.alert('Error', 'El numero ya esta en uso')
        setBotonDeshabilitado(false)
      }else{
        console.log('Numero no esta en uso ')
        const tabla_codigo = 'Codigos'
        try {
          const codigo_new = await axios.post(`${url}/createRecord?sessionId=${token_telefono}&output=json&useIds=true&objName=${tabla_codigo}&Telefono=${telefono}`)
          console.log('registro de codigo creado ' + codigo_new.data.status)
          if(codigo_new.data.status==='ok'){
            Alert.alert('Enviado',`El codigo a sido enviado a su telefono ${telefono}`)
            setBotonDeshabilitado(false)
          }
        } catch (error) {
          console.error('Error al consultar codigo:', error);
          Alert.alert('Error','No es posible solicitar codigo, intente mas tarde. ')
          setBotonDeshabilitado(false)
        }
        
        
      }
  } catch (error) {
      console.error('Error al consultar telefono:', error);
      Alert.alert('Error','No es posible consultar telefono, intente mas tarde. ')
      setBotonDeshabilitado(false)
      throw error;
  }

}


export const userActual = async()=>{
  try {
      //tabla a consultar 
      let tablaUser = 'USER'
      const token3 = await obtenerToken()
      console.log("usuario " +  user)
      const responceCliente = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=30&query=select+id+from+${tablaUser}+WHERE+loginName_TXT='${user}'&output=json`)
      //console.log('Id usuario ', responceCliente.data)
      return responceCliente.data[0][0]
  } catch (error) {
     console.error('Error al obtener la información de la tabla usuario funcion userActual:' + error)
      if(error.response){
          console.error('Error de respuesta:', error.response.data);
          console.error('Código de estado HTTP:', error.response.status);
          console.error('Encabezados de respuesta:', error.response.headers);

      }else if(error.request){
          console.error('Error de solicitud:', error.request);
      }else{
          console.error('Error:', error.message);
      }
      throw error;
  }

}

export const archivosList = async()=>{
  try {
      //tabla a consultar 
      let tablaArchivos= 'Despacho'
      const token3 = await obtenerToken()
      //R52302897 realacion cliente 
      const idusuario = await userActual()
      const usuario_inspector = "USER";
      let tablausuario_inspector = "";
      try {
        tablausuario_inspector = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+Inspector+from+${usuario_inspector}+WHERE+id=${idusuario}+ORDER+BY+id+DESC&output=json`)
        console.log("El usuario es inspector? " + tablausuario_inspector.data);
        
      } catch (error) {
        console.log("No es posible obtener informacion, para saber si usuario es inspector. " + error);
        
      }
      let responceArchivos;
      if(tablausuario_inspector.data==0){
        console.log("El usuario no es inspector peticion filtrada");
        responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+id,+name,+Secuencia,+Placa,+Estadotxt,+createdAt,+Cliente_txt,+Fecha_Manifiesto,+Manifiesto_No_,+OrigenTxt,+Direccion_Origen,+DestinoTxt,+Direccin_Entrega,+Fecha_y_Hora_de_Cargue,+Link_Inventario_Vehiculo,+Fecha_Recg_Contenedor,+
          Lugar_Recg_Contenedor,+Fecha_Max_Devolucion,+Lugar_Dev_Contenedor+from+${tablaArchivos}+WHERE+id_user_vehiculo=${idusuario}+ORDER+BY+id+DESC&output=json`)
        
      }else{
        console.log("El usuario no es inspector peticion sin filtrar ");
        responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+id,+name,+Secuencia,+Placa,+Estadotxt,+createdAt,+Cliente_txt,+Fecha_Manifiesto,+Manifiesto_No_,+OrigenTxt,+Direccion_Origen,+DestinoTxt,+Direccin_Entrega,+Fecha_y_Hora_de_Cargue,+Link_Inventario_Vehiculo,+Fecha_Recg_Contenedor,+
          Lugar_Recg_Contenedor,+Fecha_Max_Devolucion,+Lugar_Dev_Contenedor+from+${tablaArchivos}+ORDER+BY+id+DESC&output=json`)

      }
      

      console.log('Lista despachos este es el conductor ', responceArchivos.data + " usuario id " + idusuario)
      return responceArchivos.data
  } catch (error) {
      console.error('Error al obtener la información de los archivos 1 :', error);
      throw error;
  }

}



//obtener ubicacion 


export const obtenerUbicaion = async (setLatitud,setLongitud,setDireccion,setBotonDeshabilitado,setLocation) => {
  try {

      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso Denegado", "Se requiere acceso a la ubicación.");
        setBotonDeshabilitado(false); // Habilitar el botón si el permiso no es concedido
        return;
      }
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
          //console.log("Longitud " + ubicacionformat)
          ubicacionformat = encodeURIComponent(ubicacionformat)    
                        
          setDireccion(ubicacionformat);
      } else {
          setDireccion('Dirección no encontrada');
      }


  } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación." + error);
      console.log("Error al intentar obtener ubicacion " +  error);

  }

  setBotonDeshabilitado(false)

}



export const datosUsuario = async()=>{
  try {
    const tokenusuario = await obtenerToken()
    const idusuario = await userActual()
    const tablaUsuarios = "USER"
    const responDatosUser = await axios.post(`${url}/selectQuery?sessionId=${tokenusuario}&startRow=0&maxRows=1&query=select+id,+name,+email,+Documento,+R57591380+from+${tablaUsuarios}+WHERE+id=${idusuario}+ORDER+BY+id+DESC&output=json`)
    return responDatosUser.data

  } catch (error) {
    console.log("No fue posible obtener datos de usuario ", error)
  }
}

//consultar datos proveedor 
export const datosConductor = async(idConductor)=>{
  try {
    const tokenusuario = await obtenerToken()
    const tablaProveedor= "Proveedor"
    const responConductor = await axios.post(`${url}/selectQuery?sessionId=${tokenusuario}&startRow=0&maxRows=1&query=select+Nombre,+Url_Firma,+Url_Huella,+Num_Documento,+Despachos_Asignados,+Despachos_Cumplidos,+Despachos_en_Transito,+Placa_TXT+from+${tablaProveedor}+WHERE+id=${idConductor}+ORDER+BY+id+DESC&output=json`)
    console.log("datos "+ responConductor.data)
    return responConductor.data

  } catch (error) {
    console.log("No fue posible obtener datos del conductor ", error)
  }
}



export const solicitarPermisoUbicacion = async () => {
  try {
    // Solicitar permisos de ubicación
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso Denegado", "Se requiere acceso a la ubicación.");
      return false;
    }
    return true;
  } catch (error) {
    Alert.alert("Error", "No se pudo solicitar el permiso de ubicación." + error);
    console.log("Error al solicitar permiso de ubicación: " + error);
    return false;
  }
};

export const Tipo_poliza_list = async()=>{
  try {
      //tabla a consultar 
      let tablaproducto = 'Tipo_Poliza'
      const tokenpoliza = await obtenerToken()
      const responcePoliza_tipo= await axios.post(`${url}/selectQuery?sessionId=${tokenpoliza}&startRow=0&maxRows=300&query=select+name,+id+from+${tablaproducto}+ORDER+BY+id&output=json`)
      //console.log("Productos creados " + responceProducto.data)
      return responcePoliza_tipo.data
  } catch (error) {
      console.error('Error al obtener la información de la tabla:', error);
      throw error;
  }

}



//Lista de asistencia registrada

export const asistenciaList = async()=>{
  try {
      //tabla a consultar 
      let tablaArchivos= 'Asistencia'
      const token3 = await obtenerToken()
      //R52302897 realacion cliente 
      const idusuario = await userActual()
      
      const responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+id,+creador_txt,+Tipo_asistencia_txt,+name,+createdAt,+urlfoto+from+${tablaArchivos}+WHERE+createdBy=${idusuario}+ORDER+BY+id+DESC&output=json`)
      console.log('Lista asistencia supervisor', responceArchivos.data)
      return responceArchivos.data
  } catch (error) {
      console.error('Error al obtener la información de los archivos :', error);
      throw error;
  }

}

//Lista de asistencia registrada

export const asesores_asistencia = async(id_asistencia)=>{
  try {
      //tabla a consultar 
      let tablaArchivos= 'Asistencia'
      const token3 = await obtenerToken()
      //R52302897 realacion cliente 
      console.log("id asistencia " + id_asistencia);
      
      const responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+Lista_id_asesores+from+${tablaArchivos}+WHERE+id=${id_asistencia}+ORDER+BY+id+DESC&output=json`)
      
      let datos = responceArchivos.data
      datos = datos[0][0].split(',')
      
      console.log('Lista asesores supervisor', datos)
      return datos
  } catch (error) {
      console.error('Error al obtener la información de los usuarios :', error);
      throw error;
  }

}

//Lista de asistencia registrada

export const asesores_por_supervisor = async()=>{
  try {
      //tabla a consultar 
      let tablaArchivos= 'Asesor'
      const token3 = await obtenerToken()
      //R52302897 realacion cliente 
      
      const idusuario = await userActual()
      const responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+Nombre,id+from+${tablaArchivos}+WHERE+R57345067=${idusuario}+ORDER+BY+id+DESC&output=json`)
      
      let datos = responceArchivos.data
      //datos = datos[0][0].split(',')
      
      console.log('Lista asesores supervisor', datos)
      return datos
  } catch (error) {
      console.error('Error al obtener la información de los usuarios :', error);
      throw error;
  }

}





//Crear regsitro de asistencia 

export const crearRegistroAsistencia = async(tipoInformacion,foto_1_formulario,selectedString,setBotonDeshabilitadoCrear,formulario_restablecido,navigation)=>{
  try {
      //tabla a consultar 
      let tablaPqr= 'Asistencia'
      const token6 = await obtenerToken()


        const crearRgistro= await axios.post(`${url}/createRecord?sessionId=${token6}&output=json&useIds=true&objName=${tablaPqr}&Tipo_de_Asistencia=${tipoInformacion}&Asistencia_app=${selectedString}`)
        //console.log("Respues creacion ", crearRgistro.data) 
        if(crearRgistro.data.status=='ok'){
            formulario_restablecido()
            Alert.alert(
                'Registro creado',
                'Gracias. ',
                [
                    {text:'OK'}
                ]
                )

        }
        setBotonDeshabilitadoCrear(false)
        let idfoto_creacion = crearRgistro.data.id;
        //console.log("foto 3" + foto_3_formulario);
        const fotosFormulario = {
          foto1: { foto: foto_1_formulario, campo: "Foto_base64" }

        };

        for(const key in fotosFormulario){
          if (fotosFormulario.hasOwnProperty(key)) {
            if(fotosFormulario[key].foto!=="" && fotosFormulario[key].foto!==undefined){
              try {
                await enviarImagenBase64_asistencia(idfoto_creacion,fotosFormulario[key].foto,fotosFormulario[key].campo)
              } catch (error) {
                Alert.alert(
                  "Error",
                  "La foto no pudo ser enviada " + fotosFormulario[key],
                  [
                    {text:'OK'}
                  ]
                )
              }

            }
          }


        }      
  } catch (error) {
      console.error('No fue posible crear :', error);
      Alert.alert('Error','No es posible crear, intente mas tarde. ')
      throw error;
  }

  setBotonDeshabilitadoCrear(false)
  navigation.navigate('Formulario')

}



//Enviar imagen base 64

export const enviarImagenBase64_asistencia = async (id, base64Image,campo) => {
  try {
      
      const token = await obtenerToken()
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token}&objName=Asistencia`;

    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Asistencia" id="${id}" useIds="true">
        <Field name="${campo}">${base64Image}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64 de asistencia:', error);
    throw error;
  }
};

//enviar firma conductor 

export const enviarfirmaBase64conductor = async (base64Image,idConductor) => {
  try {
    
    const token2 = await obtenerToken(); // Llama a la función para obtener el token
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token2}&objName=Proveedor`;
    
    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Proveedor" id="${idConductor}" useIds="true">
        <Field name="Firma_TXT">${base64Image}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    console.log("El id del proveedor ", idConductor );
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64:', error);
    throw error;
  }
};

//url firma huella conductor 

//consultar datos proveedor 
export const datosConductor_firma_huella = async(idConductor)=>{
  try {
    const tokenusuario = await obtenerToken()
    const tablaProveedor= "Proveedor"
    const responConductor = await axios.post(`${url}/selectQuery?sessionId=${tokenusuario}&startRow=0&maxRows=1&query=select+Url_Firma,+Url_Huella+from+${tablaProveedor}+WHERE+id=${idConductor}+ORDER+BY+id+DESC&output=json`)
    console.log("datos firma y huella "+ responConductor.data)
    return responConductor.data;

  } catch (error) {
    console.log("No fue posible obtener datos del conductor ", error)
  }
}



export const enviarhuellaBase64conductor = async (base64Image,idConductor) => {
  try {
    
    const token2 = await obtenerToken(); // Llama a la función para obtener el token
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token2}&objName=Proveedor`;
    
    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Proveedor" id="${idConductor}" useIds="true">
        <Field name="Huella_TXT">${base64Image}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    console.log("El id del proveedor ", idConductor );
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64:', error);
    throw error;
  }
};


//url link de inventario 
export const link_inventario_despacho = async(id_despacho)=>{
  try {
    const tokenusuario = await obtenerToken()
    const tablaProveedor= "Despacho"
    const responConductor = await axios.post(`${url}/selectQuery?sessionId=${tokenusuario}&startRow=0&maxRows=1&query=select+Link_Inventario_Vehiculo+from+${tablaProveedor}+WHERE+id=${id_despacho}+ORDER+BY+id+DESC&output=json`)
    console.log("datos link despacho "+ responConductor.data)
    return responConductor.data;

  } catch (error) {
    console.log("No fue posible obtener datos del link despacho ", error)
  }
}


//enviar foto cargue 


export const enviar_foto_cargue = async (base64Image,id_despacho) => {
  try {
    
    const token2 = await obtenerToken(); // Llama a la función para obtener el token
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token2}&objName=Despacho`;
    
    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Despacho" id="${id_despacho}" useIds="true">
        <Field name="Huella_TXT">${base64Image}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    console.log("El id del despacho ", id_despacho );
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64:', error);
    throw error;
  }
};




//crear registro de foto despacho 



export const crearRegistro_foto = async(setBotonDeshabilitadoCrear,tipo_registro,foto_1_formulario,foto_2_formulario,foto_3_formulario,foto_4_formulario,id_despacho,formulario_restablecido,navigation,setModalcargue,setlistaActualizar,setRefreshing,setmodalDetalle)=>{
  try{
      //tabla a consultar 
      let tablaPqr= 'Doc_Despacho'
      let fecha_foto = new Date()
      const token6 = await obtenerToken()
      console.log("id despacho " +  id_despacho + " tipo " + tipo_registro + " fecha " + fecha_foto)
        const crearRgistro= await axios.post(`${url}/createRecord?sessionId=${token6}&output=json&useIds=true&objName=${tablaPqr}&Tipo=${tipo_registro}&R20993181=${id_despacho}`)
        //console.log("Respues creacion ", crearRgistro.data) // +${fechapqr},+${tipopqr},+${mediopqr},+${clienteid} &Fecha_de_Recepcion=${fechapqr}&R52302897=${clienteid}&Tipo_de_Informacion=${tipopqr}&MEDIO_DE_RECEPCIN_Q_R_S_F=${mediopqr}
        //console.log("Respues creacion ", crearRgistro.data) 
        if(crearRgistro.data.status=='ok'){
            
            Alert.alert(
                'Registro creado',
                'Gracias. ',
                [
                    {
                      text:'OK',
                      onPress:()=>{
                        setModalcargue(false)
                        
                      }
                    }
                ]
                )

        }
        setBotonDeshabilitadoCrear(false)
        let idfoto_creacion = crearRgistro.data.id;
        console.log("foto 3" + foto_4_formulario);
        const fotosFormulario = {
          foto1: { foto: foto_1_formulario, campo: "foto1_base64" },
          foto2: { foto: foto_2_formulario, campo: "foto2_base64" },
          foto3: { foto: foto_3_formulario, campo: "foto3_base64" },
          foto4: { foto: foto_4_formulario, campo: "foto4_base64" }

        };

        for(const key in fotosFormulario){
          if (fotosFormulario.hasOwnProperty(key)) {
            if(fotosFormulario[key].foto!=="" && fotosFormulario[key].foto!==undefined){
              try {
                await enviarImagenBase64_docdespacho(idfoto_creacion,fotosFormulario[key].foto,fotosFormulario[key].campo)
              } catch (error) {
                Alert.alert(
                  "Error",
                  "La foto no pudo ser enviada " + fotosFormulario[key],
                  [
                    {
                      text:'OK',
                      onPress:()=>{
                        setModalcargue(false)
                      }
                    }
                  ]
                )
              }

            }
          }


        }






      
  } catch (error) {
      console.error('No fue posible crear :', error);
      Alert.alert('Error','No es posible crear, intente mas tarde. ')
      throw error;
  }
  setlistaActualizar(1)
  formulario_restablecido()
  setBotonDeshabilitadoCrear(false)
  
  navigation.navigate('Formulario')
  

}




//fotos doc despacho

export const enviarImagenBase64_docdespacho = async (id, base64Image,campo) => {
  try {
      
      const token = await obtenerToken()
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token}&objName=Doc_Despacho`;

    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Doc_Despacho" id="${id}" useIds="true">
        <Field name="${campo}">${base64Image}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64:', error);
    throw error;
  }
};



//enviar novedad 



export const enviar_novedad = async(texto,id_despacho,setModalNovedad)=>{
  console.log("despacho id es " + id_despacho)
  try {
    
    const token2 = await obtenerToken(); // Llama a la función para obtener el token
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token2}&objName=Despacho`;
    
    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Despacho" id="${id_despacho}" useIds="true">
        <Field name="comment">${texto}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    console.log("El id del despacho ", id_despacho );
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });
    console.log("respuesta mensaje " +response.data);


    // Configura el parser para no ignorar atributos
    const parser = new XMLParser({
      ignoreAttributes: false, // Asegura que los atributos sean parseados
    });
    const result = parser.parse(response.data);

    // Verifica la estructura del resultado
    console.log("Resultado parseado: ", result);

    // Accede al atributo 'status' con '@_' como prefijo
    const status = result?.resp?.["@_status"];
    console.log("Estado de la respuesta: ", status);
    if (status === "ok") {
      Alert.alert(
        "Éxito",
        "Novedad enviada correctamente",
        [
          {
            text: 'OK',
            onPress: () => {
              setModalNovedad(false); // Cambiar el estado al presionar "OK"
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Error",
        "No se pudo enviar la novedad. Intente más tarde",
        [
          {
            text: 'OK',
            onPress: () => {
              setModalNovedad(false); // Cambiar el estado al presionar "OK"
            }
          }
        ]
      );
    }

    //return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64:', error);
    throw error;
  }
};


//lista de doc fotos

export const lista_fotos_despacho = async(id_despacho)=>{
  try {
      //tabla a consultar 
      let tablaArchivos= 'Doc_Despacho'
      const token3 = await obtenerToken()
      //R52302897 realacion cliente 
      
      
      const responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=100&query=select+id,+name,+createdAt,+url_foto1,+url_foto2,+url_foto3,+url_foto4+from+${tablaArchivos}+WHERE+R20993181=${id_despacho}+ORDER+BY+id+DESC&output=json`)
      //console.log('Lista fotos despacho', responceArchivos.data)
      return responceArchivos.data
  } catch (error) {
      console.error('Error al obtener la información de los archivos :', error);
      throw error;
  }

}


//despacho informacio 

export const despacho_informacion = async(id_despacho)=>{
  try {
      //tabla a consultar 
      let tablaArchivos= 'Despacho'
      const token3 = await obtenerToken()
      //R52302897 realacion cliente 
      const idusuario = await userActual()
      
      const responceArchivos = await axios.post(`${url}/selectQuery?sessionId=${token3}&startRow=0&maxRows=1&query=select+id,+name,+Secuencia,+Placa,+Estadotxt,+createdAt,+Cliente_txt,+Fecha_Manifiesto,+Manifiesto_No_,+OrigenTxt,+Direccion_Origen,+DestinoTxt,+Direccin_Entrega,+Fecha_y_Hora_de_Cargue,+Link_Inventario_Vehiculo,+Tipo_Contenedor,+Manifiesto_URL,+Orden_de_servicio_URL,+Remesa_URL,+Remesa_URL_2,+Remesa_URL_3,+Remesa_URL_4+from+${tablaArchivos}+WHERE+id=${id_despacho}+ORDER+BY+id+DESC&output=json`)
      //console.log('Datos de despacho', responceArchivos.data)
      return responceArchivos.data
  } catch (error) {
      console.error('Error al obtener la información de los archivos 1 :', error);
      throw error;
  }

}


export const lista_novedades = async (id_despacho) => {
  try {
    // Tabla a consultar 
    let tablaArchivos = '$COMMENT';
    const token3 = await obtenerToken();

    // Construir los parámetros de consulta
    const params = {
      sessionId: token3,
      startRow: 0,
      maxRows: 20,
      query: `select content from ${tablaArchivos} WHERE objId=${id_despacho} ORDER BY id DESC`,
      output: 'json',
    };

    // Convertir los parámetros a una cadena de consulta
    const queryStringified = queryString.stringify(params);

    // Hacer la solicitud
    const novedades = await axios.post(`${url}/selectQuery?${queryStringified}`);
    
    console.log('Novedades creadas: ', novedades.data);
    return novedades.data;

  } catch (error) {
    // Obtener más información sobre el error
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error en la respuesta del servidor:', {
        status: error.response.status,           // Código de estado HTTP
        data: error.response.data,               // Datos devueltos por el servidor
        headers: error.response.headers          // Encabezados de la respuesta
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor. Detalles de la solicitud:', error.request);
    } else {
      // Algo pasó al configurar la solicitud
      console.error('Error al hacer la solicitud:', error.message);
    }
    throw error;
  }
};


export const enviarImagenBase64_pruebas = async (id, base64Image,campo) => {
  try {
      
      const token = await obtenerToken()
    const url = `https://www.impeltechnology.com/rest/api/update?sessionId=${token}&objName=Archivos`;

    // Define el cuerpo de la solicitud en formato XML
    const xmlData = `
     
      <data objName="Doc_Despacho" id="${id}" useIds="true">
        <Field name="${campo}">${base64Image}</Field>
      </data>
    `;

    const headers = {
      'Content-Type': 'application/xml', // Tipo de contenido XML
    };

    // Realiza una solicitud PUT a la URL con los datos en el cuerpo
    //console.log('url envio ', url);
    //console.log('datos del body', xmlData);
    const response = await axios.put(url, xmlData, { headers });

    // Retorna la respuesta
    return response.data;
  } catch (error) {
    console.error('Error al enviar la imagen en base64:', error);
    throw error;
  }
};