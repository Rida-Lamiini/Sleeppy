import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { supabase } from "../../utils/supabaseClient"; // Ensure this path is correct

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    goals: "",
    challenges: "",
    sleep_knowledge: "",
  });
  const [sound, setSound] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [doublePressSound, setDoublePressSound] = useState(null);
  const [isSoundModalVisible, setIsSoundModalVisible] = useState(false);
  const [soundFiles, setSoundFiles] = useState([
    { id: 1, name: "Sonidos del bosque", file: require("../../assets/sounds/alarm1.mp3") },
    { id: 2, name: "Nature", file: require("../../assets/sounds/alarm1.mp3") },
    { id: 3, name: "Water sounds", file: require("../../assets/sounds/alarm1.mp3") },
    { id: 4, name: "Ocean", file: require("../../assets/sounds/alarm1.mp3") },
  ]);
  const [newSound, setNewSound] = useState("");
  const [modalActiveTab, setModalActiveTab] = useState("SOUNDS");

  useEffect(() => {
    const fetchOrCreateUserProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Error getting user:", error);
        setLoading(false);
        return;
      }
      const { data: existingProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error checking profile:", profileError);
        setLoading(false);
        return;
      }
      if (!existingProfile) {
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .insert([
            {
              user_id: user.id,
              name: user.user_metadata?.full_name || "New User",
              goals: [],
              challenges: [],
              sleep_knowledge: [],
            },
          ])
          .select()
          .single();
        if (insertError) {
          console.error("Error inserting profile:", insertError);
        } else {
          setUserProfile(newProfile);
        }
      } else {
        setUserProfile(existingProfile);
        setUpdatedProfile({
          name: existingProfile.name,
          goals: existingProfile.goals.join(", "),
          challenges: existingProfile.challenges.join(", "),
          sleep_knowledge: existingProfile.sleep_knowledge.join(", "),
        });
      }
      setLoading(false);
    };
    fetchOrCreateUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!userProfile) return;
    setLoading(true);
    const { error } = await supabase
      .from("user_profiles")
      .update({
        name: updatedProfile.name,
        goals: updatedProfile.goals.split(","),
        challenges: updatedProfile.challenges.split(","),
        sleep_knowledge: updatedProfile.sleep_knowledge.split(","),
      })
      .eq("user_id", userProfile.user_id);
    if (error) {
      console.error("Error updating profile:", error);
    } else {
      setUserProfile({
        ...userProfile,
        ...updatedProfile,
        goals: updatedProfile.goals.split(","),
        challenges: updatedProfile.challenges.split(","),
        sleep_knowledge: updatedProfile.sleep_knowledge.split(","),
      });
      setActiveTab(null);
    }
    setLoading(false);
  };

  const playSound = async (soundFile) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);
    setIsPlaying(true);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const handleSoundPress = (item) => {
    setSelectedSound(item.id);
    if (isPlaying && selectedSound === item.id) {
      stopSound();
    } else {
      playSound(item.file);
    }
  };

  let lastPress = 0;
  const onPressSoundItem = (item) => {
    const currentTime = new Date().getTime();
    const delta = currentTime - lastPress;

    if (delta < 300) {
      setDoublePressSound(item);
      Alert.alert("Sound Selected", `You have selected: ${item.name}`);
    } else {
      handleSoundPress(item);
    }

    lastPress = currentTime;
  };

  const handleAddSound = () => {
    if (newSound.trim()) {
      setSoundFiles([...soundFiles, { id: soundFiles.length + 1, name: newSound, file: require("../../assets/sounds/alarm1.mp3") }]);
      setNewSound("");
    }
  };

  const renderSoundItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.soundOption,
        selectedSound === item.id && styles.selectedSoundOption,
      ]}
      onPress={() => onPressSoundItem(item)}
    >
      <Text style={styles.soundText}>{item.name}</Text>
      {selectedSound === item.id && (
        <FontAwesome5
          name={isPlaying ? "pause" : "play"}
          size={16}
          color="#FF758F"
        />
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userProfile?.name || "Loading..."}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setActiveTab("EditProfile")}>
          <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          <FontAwesome5 name="edit" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
      {activeTab === "EditProfile" && (
        <View style={styles.editProfileContainer}>
          <TextInput
            placeholder="Name"
            value={updatedProfile.name}
            onChangeText={(text) => setUpdatedProfile((prev) => ({ ...prev, name: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Goals (comma separated)"
            value={updatedProfile.goals}
            onChangeText={(text) => setUpdatedProfile((prev) => ({ ...prev, goals: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Challenges (comma separated)"
            value={updatedProfile.challenges}
            onChangeText={(text) => setUpdatedProfile((prev) => ({ ...prev, challenges: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Sleep Knowledge (comma separated)"
            value={updatedProfile.sleep_knowledge}
            onChangeText={(text) => setUpdatedProfile((prev) => ({ ...prev, sleep_knowledge: text }))}
            style={styles.input}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setActiveTab(null)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      {activeTab === "Sounds" && (
        <FlatList
          data={soundFiles}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.soundList}
        />
      )}
      {activeTab === "Awakening Phase" && (
        <View style={styles.placeholderTab}>
          <Text style={styles.tabText}>Awakening Phase Content Here</Text>
        </View>
      )}
      {activeTab === "Clock" && (
        <View style={styles.placeholderTab}>
          <Text style={styles.tabText}>Clock Content Here</Text>
        </View>
      )}
      {activeTab === "Monthly Summary" && (
        <View style={styles.placeholderTab}>
          <Text style={styles.tabText}>Monthly Summary Content Here</Text>
        </View>
      )}
      {activeTab === "FindExpert" && (
        <View style={styles.placeholderTab}>
          <Text style={styles.tabText}>Look for an Expert Content Here</Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity style={styles.button} onPress={() => setIsSoundModalVisible(true)}>
        <FontAwesome5 name="music" size={18} color="#FF758F" />
        <Text style={styles.buttonText}>Sounds</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setActiveTab("Awakening Phase")}>
        <FontAwesome5 name="clock" size={18} color="#FF758F" />
        <Text style={styles.buttonText}>Awakening Phase</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setActiveTab("Clock")}>
        <FontAwesome5 name="stopwatch" size={18} color="#FF758F" />
        <Text style={styles.buttonText}>Clock</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setActiveTab("Monthly Summary")}>
        <FontAwesome5 name="calendar-alt" size={18} color="#FF758F" />
        <Text style={styles.buttonText}>Monthly Summary</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setActiveTab("FindExpert")}>
        <FontAwesome5 name="user-md" size={18} color="#FF758F" />
        <Text style={styles.buttonText}>Look for an Expert</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[]} // No data since we're using ListHeaderComponent and ListFooterComponent
        renderItem={null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.container}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSoundModalVisible}
        onRequestClose={() => setIsSoundModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alarm Sounds</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={modalActiveTab === "SOUNDS" ? styles.activeTab : styles.inactiveTab}
                onPress={() => setModalActiveTab("SOUNDS")}
              >
                <Text style={modalActiveTab === "SOUNDS" ? styles.tabTextActive : styles.tabTextInactive}>SOUNDS</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={modalActiveTab === "YOUTUBE MUSIC" ? styles.activeTab : styles.inactiveTab}
                onPress={() => setModalActiveTab("YOUTUBE MUSIC")}
              >
                <Text style={modalActiveTab === "YOUTUBE MUSIC" ? styles.tabTextActive : styles.tabTextInactive}>YOUTUBE MUSIC</Text>
              </TouchableOpacity>
            </View>
            {modalActiveTab === "SOUNDS" ? (
              <>
                <FlatList
                  data={soundFiles}
                  renderItem={renderSoundItem}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.soundList}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Add a new sound"
                  placeholderTextColor="#BBBBBB"
                  value={newSound}
                  onChangeText={setNewSound}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddSound}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.tabTextInactive}>YouTube Music integration coming soon!</Text>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsSoundModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2E1A47",
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#6A618C",
    padding: 15,
    borderRadius: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginLeft: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF758F",
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginRight: 5,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A3C6A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  soundOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A3C6A",
    padding: 10, // Adjusted padding to make the button shorter
    borderRadius: 10,
    marginBottom: 10,
    width: "100%", // Make the button wider
    height: 50, // Set a fixed height to make it shorter
    justifyContent: "space-between", // Align text and icon properly
  },
  selectedSoundOption: {
    backgroundColor: "#FF758F",
  },
  soundText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FF758F",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#6A618C",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
  soundList: {
    paddingBottom: 20,
  },
  placeholderTab: {
    padding: 20,
    backgroundColor: "#6A618C",
    borderRadius: 10,
    marginBottom: 10,
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#2E1A47",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  activeTab: {
    backgroundColor: "#FF758F",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  inactiveTab: {
    backgroundColor: "#4A3C6A",
    padding: 8,
    borderRadius: 5,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextInactive: {
    color: "#BBBBBB",
  },
  addButton: {
    backgroundColor: "#FF758F",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#FF758F",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});