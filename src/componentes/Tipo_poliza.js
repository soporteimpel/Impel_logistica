import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import globalstylesModal from "../styles/index2";


const Tipo_poliza = ({
    setModal_tipo_poliza,
    tipo_poliza_select,
    setTipo_poliza_name,
    setTipo_poliza_id
  
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function fechData() {
      try {
        const response = await tipo_poliza_select;
        setData(response);
      } catch (error) {
        console.log("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    }
    fechData();
    
  }, [tipo_poliza_select]);

  //filtrar datos
  useEffect(() => {
    const filtered = data.filter((item) =>
      item[0].toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, data]);

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView>
        <Text style={styles.labelGlobal}>Seleccione</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Pressable
          style={styles.boton}
          onPress={() => {
            setModal_tipo_poliza(false);
          }}
        >
          <Text style={styles.textboton}>Cancelar</Text>
        </Pressable>

        {loading ? (
          <Text>Cargndo...</Text>
        ) : (
          filteredData.map((item, index) => (
            <Pressable
              key={index}
              style={styles.boton}
              onPress={() => {
                console.log("Item " + item[0]);
                setTipo_poliza_name(item[0]);
                setTipo_poliza_id(item[1]);
                setModal_tipo_poliza(false);
              }}
            >
              <Text style={styles.textboton}>{item[0]}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    ...globalstylesModal.contenedor,
    flex: 1,
    backgroundColor: "#D6E8EE",
    alignItems: "center",
    marginBottom: 40,
  },
  labelGlobal: {
    textAlign: "center",
    fontSize: 25,
  },
  boton: {
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  textboton: {
    textAlign: "center",
    color: "#000000",
    fontWeight: "bold",
  },
  searchInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    //borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
export default Tipo_poliza;

