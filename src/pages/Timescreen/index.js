import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const trashIcon = require('../../assets/icon/trash.png');
const clockIcon = require('../../assets/icon/jam.png');

const FeedScheduleScreen = ({ navigation }) => {
  const [schedule, setSchedule] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');

  useEffect(() => {
    const fetchDatabaseToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        let database = '';
        if (token === 'TW01') {
          database = 'IFTPetFeeder1';
        } else if (token === 'PO20') {
          database = 'IFTPetFeeder2';
        }
        setSelectedDatabase(database);
      } catch (error) {
        console.error('Error fetching database token:', error);
      }
    };

    fetchDatabaseToken();
  }, []);

  useEffect(() => {
    const ref = firebase.database().ref(`/${selectedDatabase}/IFTPetFeeder/Schedule`);
    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const scheduleArray = Object.keys(data).map(key => ({
          id: key,
          day: data[key].Day,
          food: data[key].Food,
          gram: data[key].Gram,
          time: data[key].Time,
          isActive: data[key].Action === 1,
        }));
        setSchedule(scheduleArray);
      }
    };

    ref.on('value', onDataChange);

    return () => {
      ref.off('value', onDataChange);
    };
  }, [selectedDatabase]);

  const toggleSchedule = async (id) => {
    const updatedSchedule = schedule.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, isActive: !item.isActive };
        return updatedItem;
      }
      return item;
    });
  
    setSchedule(updatedSchedule);
  
    try {
      const index = updatedSchedule.findIndex(item => item.id === id);
      if (index !== -1) {
        await firebase.database().ref(`/${selectedDatabase}/IFTPetFeeder/Schedule/${updatedSchedule[index].id}/Action`).set(updatedSchedule[index].isActive ? 1 : 0);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };  

  const removeSchedule = async (id) => {
    try {
      await firebase.database().ref(`/${selectedDatabase}/IFTPetFeeder/Schedule/${id}`).remove();
      setSchedule(prevSchedule => prevSchedule.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing schedule:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Timescreen')} style={styles.backButton}>
        <Image source={clockIcon} style={styles.clockIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Feed Schedule</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {schedule.map(item => (
          <ScheduleItem key={item.id} item={item} toggleSchedule={() => toggleSchedule(item.id)} removeSchedule={() => removeSchedule(item.id)} />
        ))}
      </ScrollView>
    </View>
  );
};

const ScheduleItem = ({ item, toggleSchedule, removeSchedule }) => (
  <View style={styles.scheduleItem}>
    <View style={styles.scheduleInfo}>
      <Text style={styles.scheduleText}>{item.time}</Text>
      <Text style={styles.scheduleText}>{item.food}</Text>
      <Text style={styles.scheduleText}>{item.gram}</Text>
      <Text style={styles.scheduleText}>{item.day}</Text>
    </View>
    <View style={styles.buttonContainer}>
      <Switch
        value={item.isActive}
        onValueChange={toggleSchedule}
      />
      <TouchableOpacity onPress={removeSchedule} style={styles.trashButton}>
        <Image source={trashIcon} style={styles.trashIcon} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',
    color: '#0B1C3F',
    marginLeft: 25,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor : '#DEA369',
    borderRadius: 8,
    padding: 10,
    width: '100%',

   
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleText: {
    color: '#0B1C3F',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  clockIcon: {
    width: 20,
    height: 20,
  },
  trashButton: {
    marginLeft: 10,
  },
  trashIcon: {
    width: 20,
    height: 20,
  },
});

export default FeedScheduleScreen;
