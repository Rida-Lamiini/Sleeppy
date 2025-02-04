import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { router, useRouter } from 'expo-router';

const AlarmRingScreen = ({ navigation }) => {
  const [sound, setSound] = useState(null);

  // Load and play the alarm sound
  const playAlarmSound = async () => {
    const { sound: alarmSound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/alarm1.mp3'), // Replace with your alarm sound file
      { shouldPlay: true, isLooping: true }
    );
    setSound(alarmSound);
    await alarmSound.playAsync();
  };

  // Stop the alarm sound
  const stopAlarmSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  };

  // Handle notification when the alarm rings
  useEffect(() => {
    
      
        playAlarmSound();
    


  }, []);

  // Dismiss the alarm
  const dismissAlarm = () => {
    stopAlarmSound();
    router.back(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm is Ringing!</Text>
      <TouchableOpacity style={styles.button} onPress={dismissAlarm}>
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E213A',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AlarmRingScreen;