import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { supabase } from "../../utils/supabaseClient";

const AlarmCard = ({
  wakeUpTime,
  sleepTime,
  selectedDays,
  onToggleDay,
  onEditTime,
  isExpanded,
  toggleExpand,
  isActive, // Pass isActive as a prop
  onToggleActive, // Function to toggle active state
}) => {
  const days = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <SafeAreaView>
      <View style={styles.card}>
        <View style={styles.timeRow}>
          <TouchableOpacity
            onPress={() => onEditTime(true)}
            style={styles.timeBox}
          >
            <Text style={styles.timeText}>{wakeUpTime}</Text>
            <Text style={styles.timeLabel}>WAKE UP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onEditTime(false)}
            style={styles.timeBox}
          >
            <Text style={styles.timeText}>{sleepTime}</Text>
            <Text style={styles.timeLabel}>SLEEP</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <>
            {/* Days of the Week */}
            <View style={styles.daysContainer}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    selectedDays[index] && styles.activeDayButton,
                  ]}
                  onPress={() => onToggleDay(index)}
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

            {/* Routines */}
            <View style={styles.routinesContainer}>
              <TouchableOpacity style={styles.routineRow}>
                <Ionicons name="logo-youtube" size={24} color="#FF0000" />
                <Text style={styles.routineText}>
                  Red Heels (Official Video)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.routineRow}>
                <Ionicons name="logo-google" size={24} color="#4285F4" />
                <Text style={styles.routineText}>Google Assistant Routine</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.routineRow}>
                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                <Text style={styles.routineText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Toggle Active */}
        <TouchableOpacity onPress={onToggleActive} style={styles.activeToggle}>
          <Ionicons
            name={isActive ? "toggle" : "toggle-outline"}
            size={24}
            color={isActive ? "#FF6B6B" : "#A5A5A5"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
          <Ionicons
            name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function WakeUpSleepSetup() {
  const [alarms, setAlarms] = useState([
    {
      wakeUpTime: "07:00",
      sleepTime: "22:00",
      selectedDays: [true, true, true, true, true, true, true],
      isExpanded: false,
      isActive: true, // Add this to set the alarm as active by default
    },
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempWakeUpTime, setTempWakeUpTime] = useState("07:00");
  const [tempSleepTime, setTempSleepTime] = useState("22:00");
  const [tempSelectedDays, setTempSelectedDays] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [userId, setUserId] = useState();
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          throw new Error("No active session. Please log in again.");
        }

        setUserId(session.user.id);

        console.log(userId);
      } catch (error) {
        console.error("Error fetching user name:", error.message);
        Alert.alert("Error", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, []);

  const toggleDay = (index) => {
    const updatedDays = [...tempSelectedDays];
    updatedDays[index] = !updatedDays[index];
    setTempSelectedDays(updatedDays);
  };

  const toggleActive = async (index) => {
    try {
      const selectedAlarm = alarms[index];

      // If the alarm is already active, do nothing
      if (selectedAlarm.isActive) return;

      // Get the alarm ID (you need to store the ID in the alarms state)
      const { data: alarmData, error: fetchError } = await supabase
        .from("sleep_plans")
        .select("id")
        .eq("user_id", userId);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const selectedAlarmId = alarmData[index].id;

      // Update the database: Set the selected alarm as active and deactivate others
      const { error: updateError } = await supabase
        .from("sleep_plans")
        .update({ is_active: false })
        .eq("user_id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      const { error: activateError } = await supabase
        .from("sleep_plans")
        .update({ is_active: true })
        .eq("id", selectedAlarmId);

      if (activateError) {
        throw new Error(activateError.message);
      }

      // Update the state
      const updatedAlarms = alarms.map((alarm, i) => ({
        ...alarm,
        isActive: i === index, // Set only the selected alarm to active
      }));

      setAlarms(updatedAlarms);
    } catch (error) {
      console.error("Error updating alarm status:", error.message);
    }
  };

  const addAlarm = async () => {
    try {
      const { data, error } = await supabase
        .from("sleep_plans")
        .insert([
          {
            user_id: userId,
            wake_up_time: tempWakeUpTime,
            sleep_time: tempSleepTime,
            selected_days: tempSelectedDays,
            is_active: true, // New alarm is active
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newAlarmId = data[0].id;

        await supabase
          .from("sleep_plans")
          .update({ is_active: false })
          .eq("user_id", userId)
          .neq("id", newAlarmId); // Set all others to inactive

        fetchAlarms(); // Refresh alarm list after update
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Error adding alarm:", error.message);
    }
  };

  const toggleExpand = (index) => {
    const updatedAlarms = alarms.map((alarm, i) =>
      i === index ? { ...alarm, isExpanded: !alarm.isExpanded } : alarm
    );
    setAlarms(updatedAlarms);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session)
          throw new Error("No active session. Please log in.");

        setUserId(session.user.id);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAlarms();
    }
  }, [userId]); // Fetch alarms when userId is set

  const fetchAlarms = async () => {
    try {
      const { data, error } = await supabase
        .from("sleep_plans")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false }); // Fetch alarms for the current user

      if (error) throw error;

      if (data) {
        // Convert database format to local state format
        const formattedAlarms = data.map((alarm) => ({
          wakeUpTime: alarm.wake_up_time,
          sleepTime: alarm.sleep_time,
          selectedDays: alarm.selected_days || [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ], // Ensure an array
          isExpanded: false,
          isActive: alarm.is_active,
          id: alarm.id, // Store the database ID
        }));

        setAlarms(formattedAlarms);
      }
    } catch (error) {
      console.error("Error fetching alarms:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Return</Text>
        </View>
        {alarms.map((alarm, index) => (
          <AlarmCard
            key={index}
            wakeUpTime={alarm.wakeUpTime}
            sleepTime={alarm.sleepTime}
            selectedDays={alarm.selectedDays}
            isActive={alarm.isActive} // Pass the active state
            onToggleActive={() => toggleActive(index)} // Pass the toggle function
            onToggleDay={(dayIndex) => {
              const updatedDays = [...alarm.selectedDays];
              updatedDays[dayIndex] = !updatedDays[dayIndex];
              const updatedAlarms = [...alarms];
              updatedAlarms[index].selectedDays = updatedDays;
              setAlarms(updatedAlarms);
            }}
            onEditTime={(isWakeUp) => {
              setTempWakeUpTime(alarm.wakeUpTime);
              setTempSleepTime(alarm.sleepTime);
              setModalVisible(true);
            }}
            isExpanded={alarm.isExpanded}
            toggleExpand={() => toggleExpand(index)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Adding Alarm */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set New Alarm</Text>
            <TextInput
              style={styles.timeInput}
              value={tempWakeUpTime}
              keyboardType="numeric"
              onChangeText={(text) => setTempWakeUpTime(text)}
              placeholder="Wake Up HH:MM"
              maxLength={5}
            />
            <TextInput
              style={styles.timeInput}
              value={tempSleepTime}
              keyboardType="numeric"
              onChangeText={(text) => setTempSleepTime(text)}
              placeholder="Sleep HH:MM"
              maxLength={5}
            />
            <View style={styles.daysContainer}>
              {tempSelectedDays.map((isSelected, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    isSelected && styles.activeDayButton,
                  ]}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    style={[styles.dayText, isSelected && styles.activeDayText]}
                  >
                    {"LMMJVSD"[index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.acceptButton} onPress={addAlarm}>
                <Text style={styles.acceptText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E213A",
  },
  card: {
    backgroundColor: "#292A2D",
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeBox: {
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  timeLabel: {
    color: "#A5A5A5",
    fontSize: 14,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#393C4A",
  },
  activeDayButton: {
    backgroundColor: "#FF6B6B",
  },
  dayText: {
    color: "#fff",
    fontSize: 14,
  },
  activeDayText: {
    color: "#fff",
    fontWeight: "700",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#FF6B6B",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "#292A2D",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  timeInput: {
    backgroundColor: "#393C4A",
    color: "#fff",
    borderRadius: 8,
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    width: "80%",
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelText: {
    color: "#A5A5A5",
    fontWeight: "700",
  },
  expandButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  routinesContainer: {
    marginVertical: 20,
  },
  routineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  routineText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  activeToggle: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
