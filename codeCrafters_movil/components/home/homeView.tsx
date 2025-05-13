import { Link } from "expo-router";
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

export function HomeView() {
  return (
    <ImageBackground style={styles.background} resizeMode="cover" source={require("../../assets/images/fondoHome.jpg")}>
      <View style={styles.content}>
        <View style={styles.centerTitle}>
          <Text style={styles.title}>Menú</Text>
          <Image
            style={styles.image}
            source={require("../../assets/images/logo.png")}
          />
        </View>
        <View style={styles.contentBotones}>


          <Link href="/(logs)" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.textButton}>Registros</Text>
            </Pressable>
          </Link>

          <Link href="/(logs)/homeUnlock" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.textButton}>Desbloquear</Text>
            </Pressable>
          </Link>

          <Link href="../auth/profile" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.textButton}>Perfil</Text>
            </Pressable>
          </Link>



        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "95%",
    height: "60%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  centerTitle: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white"
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  contentBotones: {
    width: "80%",
    height: "40%",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },
  button: {
    width: 150,
    height: "auto",
    padding: 5,
    borderWidth: 2,
    borderRadius: 16,
    textAlign: "center",
    backgroundColor: "rgba(126, 160, 252, 0.76)",
  },

});  