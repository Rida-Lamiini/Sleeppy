import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/supabaseClient";

export default function SleepPlan() {
  const [sections, setSections] = useState({
    sleepPlan: true,
    everyDay: true,
    routines: true,
  });
  const [selectedDays, setSelectedDays] = useState(Array(7).fill(true));
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempWakeUpTime, setTempWakeUpTime] = useState("07:00");
  const [tempSleepTime, setTempSleepTime] = useState("22:00");

  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleDay = (index) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    setSelectedDays(newDays);
  };

  const addNewSleepPlan = () => {
    console.log("New sleep plan:", {
      wakeUpTime: tempWakeUpTime,
      sleepTime: tempSleepTime,
      days: selectedDays,
    });

    addSleepPlan(tempWakeUpTime, tempSleepTime, selectedDays);
    setModalVisible(false); // Close modal after adding plan
    resetForm(); // Reset form fields
  };

  // Reset form fields after closing modal
  const resetForm = () => {
    setTempWakeUpTime("07:00");
    setTempSleepTime("22:00");
    setSelectedDays(Array(7).fill(true));
  };

  // Add a new sleep plan
  async function addSleepPlan(wakeUpTime, sleepTime, selectedDays) {
    const user = supabase.auth.user();
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    console.log("Sending sleep plan data:", {
      user_id: user.id,
      wakeUpTime,
      sleepTime,
      selectedDays,
    });

    const { data, error } = await supabase
      .from("sleep_plans")
      .insert([
        {
          user_id: user.id, // Link to the logged-in user
          wake_up_time: wakeUpTime,
          sleep_time: sleepTime,
          selected_days: selectedDays,
          is_active: true,
        },
      ])
      .single();

    if (error) {
      console.error("Error adding sleep plan:", error.message);
      return;
    }

    console.log("Data sent successfully:", data);
  }

  return (
    <View style={styles.container}>
      {/* Sleep Plan Section */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection("sleepPlan")}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Sleep plan</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Ionicons
          name={sections.sleepPlan ? "chevron-up" : "chevron-down"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      {sections.sleepPlan && (
        <View style={styles.content}>
          {/* Wake/Sleep Time */}
          <View style={styles.timeBlocksContainer}>
            <View style={styles.timeBlock}>
              <View style={styles.dotPattern}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>
              <Text style={styles.timeLabel}>WAKE UP</Text>
            </View>
            <View style={styles.timeBlock}>
              <View style={styles.dotPattern}>
                {[...Array(5)].map((_, i) => (
                  <View key={i} style={styles.dot} />
                ))}
              </View>
              <Text style={styles.timeLabel}>SLEEP</Text>
            </View>
          </View>

          {/* Every Day Section */}
          <TouchableOpacity
            style={styles.subSectionHeader}
            onPress={() => toggleSection("everyDay")}
          >
            <Text style={styles.subHeaderTitle}>Every day</Text>
            <Ionicons
              name={sections.everyDay ? "chevron-up" : "chevron-down"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {sections.everyDay && (
            <View style={styles.daysContainer}>
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    selectedDays[index] && styles.activeDayButton,
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDays[index] && styles.activeDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Routines Section */}
          <TouchableOpacity
            style={styles.subSectionHeader}
            onPress={() => toggleSection("routines")}
          >
            <Text style={styles.subHeaderTitle}>Routines</Text>
            <Ionicons
              name={sections.routines ? "chevron-up" : "chevron-down"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>

          {sections.routines && (
            <View style={styles.routinesContainer}>
              <TouchableOpacity style={styles.routineItem}>
                <View style={styles.routineLeft}>
                  <Ionicons name="heart" size={22} color="#ff4545" />
                  <Text style={styles.routineText}>
                    Red Heart (Official Video)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.routineItem}>
                <View style={styles.routineLeft}>
                  <Ionicons name="logo-google" size={22} color="#fff" />
                  <Text style={styles.routineText}>
                    Google Assistant Routine
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.routineItem}>
                <View style={styles.routineLeft}>
                  <Ionicons name="trash-outline" size={22} color="#ff4545" />
                  <Text style={[styles.routineText, { color: "#ff4545" }]}>
                    Delete
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#1a1b1e" />
      </TouchableOpacity>

      {/* Modal for Adding New Sleep Plan */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set New Sleep Plan</Text>
            <TextInput
              style={styles.timeInput}
              value={tempWakeUpTime}
              onChangeText={setTempWakeUpTime}
              placeholder="Wake Up Time (HH:MM)"
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.timeInput}
              value={tempSleepTime}
              onChangeText={setTempSleepTime}
              placeholder="Sleep Time (HH:MM)"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.addPlanButton}
                onPress={addNewSleepPlan}
              >
                <Text style={styles.addPlanButtonText}>Add Plan s</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1b1e",
    borderRadius: 12,
    overflow: "hidden",
    margin: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2a2e33",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    marginRight: 8,
  },
  content: {
    padding: 16,
    backgroundColor: "#2a2e33",
  },
  timeBlocksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeBlock: {
    flex: 1,
    alignItems: "center",
  },
  dotPattern: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff4545",
  },
  timeLabel: {
    color: "#fff",
    fontSize: 14,
  },
  subSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  subHeaderTitle: {
    fontSize: 16,
    color: "#fff",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeDayButton: {
    backgroundColor: "#ff4545",
  },
  dayText: {
    color: "#fff",
  },
  activeDayText: {
    color: "#fff",
  },
  addButton: {
    padding: 16,
    backgroundColor: "#ff4545",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  timeInput: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addPlanButton: {
    backgroundColor: "#ff4545",
    padding: 12,
    borderRadius: 8,
  },
  addPlanButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
  },
  routinesContainer: {
    marginTop: 16,
  },
  routineItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  routineLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  routineText: {
    color: "#fff",
    marginLeft: 8,
  },
});
