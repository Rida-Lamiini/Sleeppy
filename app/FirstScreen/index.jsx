import React, { useState, useEffect } from "react";
import { Text, View, Pressable, ImageBackground, Image, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  
  const images = [
    require("../../assets/images/FirstPic.png"), 
    require("../../assets/images/SecondPic.png"), 
    require("../../assets/images/ThirdPic.png"), 
  ];

  
  const texts = [
    "Increase your physical endurance with a good night's sleep",
    "Achieve a more rejuvenated appearance just by sleeping better",
    "Discover how we can easily relax and enjoy a good night's sleep",
  ];

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, [images.length]);

  return (
    <ImageBackground
      source={require("../../assets/images/icon.png")} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Image placeholder at the top */}
        <View style={styles.imagePlaceholder}>
          <Image source={images[currentImageIndex]} style={styles.placeholderImage} />
        </View>

        {/* Text in the middle */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{texts[currentImageIndex]}</Text>
        </View>

        {/* Three dots */}
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentImageIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Buttons at the bottom */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.startButton} onPress={() => router.push("/register")}>
            <Text style={styles.buttonText}>START</Text>
          </Pressable>
          <Pressable style={styles.signInButton} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", 
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between", 
    alignItems: "center",
    backgroundColor: "#423F55", 
    paddingHorizontal: 0, 
  },
  imagePlaceholder: {
    width: "100%", 
    height: 400, 
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", 
    marginTop: 20, 
    borderWidth: 10, 
    borderColor: "#EEBBC3", 
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 1000, 
    borderBottomRightRadius: 1000, 
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", 
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#FFFFFF", 
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20, 
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5, 
  },
  activeDot: {
    backgroundColor: "#EEBBC3",
  },
  inactiveDot: {
    backgroundColor: "#ccc", 
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20, 
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: "#EEBBC3",
    padding: 15,
    borderRadius: 10,
    width: "100%", 
    alignItems: "center",
    marginBottom: 10, 
  },
  signInButton: {
    backgroundColor: "transparent", 
    padding: 15,
    borderRadius: 10,
    width: "100%", 
    alignItems: "center",
    borderWidth: 2, 
    borderColor: "#EEBBC3", 
  },
  buttonText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
  },
});