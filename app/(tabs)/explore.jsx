import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Audio } from "expo-av"; // For audio playback
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const ExplorePage = () => {
  const [sound, setSound] = useState(null); // To manage the audio object
  const [isPlaying, setIsPlaying] = useState(false); // To track if audio is playing
  const [currentTrack, setCurrentTrack] = useState(null); // To store the current track info
  const [activeTab, setActiveTab] = useState("EXPLORE"); // To track the active tab
  const [viewMoreSection, setViewMoreSection] = useState(null); // To track which section is expanded
  const [searchQuery, setSearchQuery] = useState(""); // To manage the search query
  const [selectedTip, setSelectedTip] = useState(null); // To track the selected tip
  const [selectedMeditation, setSelectedMeditation] = useState(null); // To track the selected meditation

  // Notification state and listeners
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for push notifications and handle tokens
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Listen for notifications when the app is open
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Handle when the user interacts with the notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped the notification:", response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Function to request notification permissions and get a push token
  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "You need to enable notifications to receive updates."
        );
        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        if (!projectId) throw new Error("Project ID not found");

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log("Expo Push Token:", token);
      } catch (e) {
        console.error("Error getting push token:", e);
      }
    } else {
      Alert.alert(
        "Device Required",
        "Push Notifications need a physical device."
      );
    }

    return token;
  }

  // Function to send the push notification
  const sendPushNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Bedtime Reminder!",
          body: "It's almost your bedtime! Get ready to sleep.",
        },
        trigger: {
          seconds: 1, // Trigger immediately for testing
        },
      });
      console.log("Bedtime reminder sent!");
    } catch (e) {
      console.error("Error sending notification:", e);
    }
  };

  // Function to play audio
  const playAudio = async (audio) => {
    if (sound) {
      await sound.unloadAsync(); // Stop any currently playing audio
    }

    const { sound: newSound } = await Audio.Sound.createAsync(audio.file);
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
    setCurrentTrack(audio); // Set the current track info
  };

  // Function to stop audio
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  // Function to toggle play/pause
  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Audio files with metadata and images
  const audioFiles = {
    relaxingMusic: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Relaxing Music",
      image: require("../../assets/images/relax.jpg"),
    },
    natureSounds: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Nature Sounds",
      image: require("../../assets/images/nature.jpg"),
    },
    whiteNoise: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "White Noise",
      image: require("../../assets/images/white.jpg"),
    },
    rainforest: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Rainforest",
      image: require("../../assets/images/rainf.jpg"),
    },
    birdsChirping: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Birds Chirping",
      image: require("../../assets/images/bird.jpg"),
    },
    windInTrees: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Wind in Trees",
      image: require("../../assets/images/windt.jpg"),
    },
    oceanWaves: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Ocean Waves",
      image: require("../../assets/images/waves.jpg"),
    },
    seagulls: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Seagulls",
      image: require("../../assets/images/seagulls.jpg"),
    },
    sunsetBeach: {
      file: require("../../assets/sounds/alarm1.mp3"),
      name: "Sunset Beach",
      image: require("../../assets/images/sunset.jpg"),
    },
  };

  // Tips data
  const tips = [
    {
      id: 1,
      title: "10 Tips for Better Sleep",
      description:
        "1. Stick to a sleep schedule. 2. Create a bedtime routine. 3. Avoid caffeine and nicotine. 4. Limit screen time before bed. 5. Exercise regularly. 6. Create a comfortable sleep environment. 7. Avoid large meals before bed. 8. Manage stress. 9. Limit naps. 10. Seek professional help if needed.",
    },
    {
      id: 2,
      title: "How to Create a Relaxing Bedtime Routine",
      description:
        "1. Set a consistent bedtime. 2. Take a warm bath. 3. Read a book. 4. Practice deep breathing. 5. Listen to calming music. 6. Avoid screens. 7. Use essential oils. 8. Write in a journal. 9. Stretch or do light yoga. 10. Meditate.",
    },
    {
      id: 3,
      title: "The Benefits of Meditation",
      description:
        "Meditation can reduce stress, improve focus, enhance self-awareness, promote emotional health, and increase attention span. It can also help with anxiety, depression, and sleep issues.",
    },
  ];

  // Meditations data
  const meditations = [
    {
      id: 1,
      title: "5-Minute Morning Meditation",
      description:
        "Start your day with a quick 5-minute meditation to set a positive tone. Focus on your breath and let go of any tension.",
    },
    {
      id: 2,
      title: "Deep Sleep Meditation",
      description:
        "A guided meditation to help you relax and fall asleep faster. Focus on calming your mind and body.",
    },
    {
      id: 3,
      title: "Stress Relief Meditation",
      description:
        "A 10-minute meditation to help you release stress and find inner peace. Focus on your breath and let go of worries.",
    },
  ];

  // Function to filter audio files based on search query
  const filteredAudioFiles = (query) => {
    return Object.values(audioFiles).filter((audio) =>
      audio.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Function to handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() !== "") {
      setActiveTab("SOUNDS"); // Automatically switch to the SOUNDS tab
    }
  };

  // Function to render content based on the active tab
  const renderContent = () => {
    if (viewMoreSection) {
      // Render expanded section based on the "View More" button clicked
      switch (viewMoreSection) {
        case "POPULAR_SOUNDS":
          return renderSection("Popular Sounds", [
            audioFiles.relaxingMusic,
            audioFiles.natureSounds,
            audioFiles.whiteNoise,
          ]);
        case "FOREST_SOUNDS":
          return renderSection("Forest Sounds", [
            audioFiles.rainforest,
            audioFiles.birdsChirping,
            audioFiles.windInTrees,
          ]);
        case "BEACH_SOUNDS":
          return renderSection("Beach Sounds", [
            audioFiles.oceanWaves,
            audioFiles.seagulls,
            audioFiles.sunsetBeach,
          ]);
        default:
          return null;
      }
    }

    // Default content for the EXPLORE tab
    switch (activeTab) {
      case "EXPLORE":
        return (
          <>
            {/* Wide Picture with Description */}
            <View style={styles.wideImageContainer}>
              <Image
                source={require("../../assets/images/rest.png")}
                style={styles.wideImage}
              />
              <View style={styles.wideImageOverlay}>
                <Text style={styles.wideImageText}>Restful Sleep</Text>
                <Text style={styles.wideImageDescription}>Discover the best sounds for a peaceful night's sleep.</Text>
              </View>
            </View>

            {/* Popular Sounds Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Sounds</Text>
              <Text style={styles.sectionDescription}>Top picks for relaxation and focus.</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderSoundCards([
                  audioFiles.relaxingMusic,
                  audioFiles.natureSounds,
                  audioFiles.whiteNoise,
                ])}
              </ScrollView>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setViewMoreSection("POPULAR_SOUNDS")}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            </View>

            {/* Forest Sounds Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Forest Sounds</Text>
              <Text style={styles.sectionDescription}>Immerse yourself in the tranquility of the forest.</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderSoundCards([
                  audioFiles.rainforest,
                  audioFiles.birdsChirping,
                  audioFiles.windInTrees,
                ])}
              </ScrollView>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setViewMoreSection("FOREST_SOUNDS")}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            </View>

            {/* Beach Sounds Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Beach Sounds</Text>
              <Text style={styles.sectionDescription}>Relax to the soothing sounds of the ocean.</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderSoundCards([
                  audioFiles.oceanWaves,
                  audioFiles.seagulls,
                  audioFiles.sunsetBeach,
                ])}
              </ScrollView>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setViewMoreSection("BEACH_SOUNDS")}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case "MEDITATION":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Guided Meditations</Text>
            <ScrollView>
              {selectedMeditation ? (
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>{selectedMeditation.title}</Text>
                  <Text style={styles.detailDescription}>{selectedMeditation.description}</Text>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedMeditation(null)}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                meditations.map((meditation) => (
                  <TouchableOpacity
                    key={meditation.id}
                    style={styles.meditationCard}
                    onPress={() => setSelectedMeditation(meditation)}
                  >
                    <Text style={styles.meditationText}>{meditation.title}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        );
      case "SOUNDS":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Sound Library</Text>
            <ScrollView>
              {filteredAudioFiles(searchQuery).map((audio, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.soundCard}
                  onPress={() => playAudio(audio)}
                >
                  <Image source={audio.image} style={styles.soundCardImage} />
                  <Text style={styles.soundText}>{audio.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case "TIPS":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentText}>Tips for Better Sleep</Text>
            <ScrollView>
              {selectedTip ? (
                <View style={styles.detailContainer}>
                  <Text style={styles.detailTitle}>{selectedTip.title}</Text>
                  <Text style={styles.detailDescription}>{selectedTip.description}</Text>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedTip(null)}
                  >
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                tips.map((tip) => (
                  <TouchableOpacity
                    key={tip.id}
                    style={styles.tipCard}
                    onPress={() => setSelectedTip(tip)}
                  >
                    <Text style={styles.tipText}>{tip.title}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  // Helper function to render sound cards
  const renderSoundCards = (sounds) => {
    return sounds.map((audio, index) => (
      <TouchableOpacity key={index} style={styles.card} onPress={() => playAudio(audio)}>
        <Image
          source={audio.image} // Use the image from the audio object
          style={styles.cardImage}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardText}>{audio.name}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  // Helper function to render expanded sections
  const renderSection = (title, sounds) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderSoundCards(sounds)}
        </ScrollView>
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => setViewMoreSection(null)} // Go back to the main view
        >
          <Text style={styles.viewMoreText}>Back to Explore</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header and Search Bar Container */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>What Do You Want To Search For?</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch} // Handle search input
          />
        </View>

        {/* Conditionally Render Tabs */}
        {!viewMoreSection && (
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("EXPLORE")}>
              <Text style={[styles.tabText, activeTab === "EXPLORE" && styles.activeTabText]}>EXPLORE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("MEDITATION")}>
              <Text style={[styles.tabText, activeTab === "MEDITATION" && styles.activeTabText]}>MEDITATION</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("SOUNDS")}>
              <Text style={[styles.tabText, activeTab === "SOUNDS" && styles.activeTabText]}>SOUNDS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("TIPS")}>
              <Text style={[styles.tabText, activeTab === "TIPS" && styles.activeTabText]}>TIPS</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Render content based on the active tab */}
        {renderContent()}
      </ScrollView>

      {/* Music Player Tab */}
      {currentTrack && (
        <View style={styles.musicPlayerTab}>
          <Text style={styles.musicPlayerText}>Now Playing: {currentTrack.name}</Text>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Text style={styles.playPauseButtonText}>
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopAudio} style={styles.stopButton}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A618C",
    padding: 20,
  },
  headerContainer: {
    backgroundColor: "#5A527A",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#EEBBC3",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EEBBC3",
  },
  activeTabText: {
    color: "#FFFFFF", // Highlight color for active tab
  },
  wideImageContainer: {
    marginBottom: 20,
    position: "relative",
  },
  wideImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  wideImageOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  wideImageText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  wideImageDescription: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#EEBBC3",
    marginBottom: 10,
  },
  card: {
    width: 150,
    marginRight: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  viewMoreButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  viewMoreText: {
    color: "#EEBBC3",
    fontWeight: "bold",
  },
  musicPlayerTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#5A527A",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  musicPlayerText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  playPauseButton: {
    backgroundColor: "#EEBBC3",
    padding: 10,
    borderRadius: 5,
  },
  playPauseButtonText: {
    color: "#6A618C",
    fontWeight: "bold",
  },
  stopButton: {
    backgroundColor: "#EEBBC3",
    padding: 10,
    borderRadius: 5,
  },
  stopButtonText: {
    color: "#6A618C",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  tabContentText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  meditationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  meditationText: {
    fontSize: 16,
    color: "#6A618C",
  },
  soundCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  soundCardImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  soundText: {
    fontSize: 16,
    color: "#6A618C",
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    color: "#6A618C",
  },
  detailContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6A618C",
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 14,
    color: "#6A618C",
  },
  backButton: {
    backgroundColor: "#EEBBC3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButtonText: {
    color: "#6A618C",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ExplorePage;