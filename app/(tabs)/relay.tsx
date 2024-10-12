import { Alert, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Swimmer, useDatabase } from '@/database/useDatabase';
import makeRelay, { Relay } from '@/utils/relayUtils';
import timeToString from '@/utils/timeToString';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { defaultBlue, defaultDark, defaultLight, pickerText } from '@/constants/Colors';

const gender: { [key: string]: string } = {
  "M": "Male",
  "F": "Female",
}

const relayOptionMap: {[key:string]: {course:string, distance: number}} = {
  "4x50m Medley Relay (SCM)": { course: "SCM", distance: 50 },
  "4x50m Medley Relay (LCM)": { course: "LCM", distance: 50 },
  "4x100m Medley Relay (SCM)": { course: "SCM", distance: 100 },
  "4x100m Medley Relay (LCM)": { course: "LCM", distance: 100 },
};

export default function RelayScreen() {
  const [swimmersList, setSwimmersList] = useState<Swimmer[]>([]);
  const [selectedSwimmers, setSelectedSwimmers] = useState<number[]>([0, 0, 0, 0]);
  const [bestRelay, setBestRelay] = useState<Relay | null>(null);
  const [selectedRelay, setSelectedRelay] = useState<string>("4x50m Medley Relay (SCM)");
  const [modalVisible, setModalVisible] = useState(false);

  const database = useDatabase();

  async function getSwimmers() {
    try {
      const response = await database.listSwimmers();
      setSwimmersList(response);
    } catch (error) {
      Alert.alert("Error", String(error));;
    }
  }

  useEffect(() => {
    getSwimmers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getSwimmers();
    }, [])
  );

  const handleSwimmerChange = (index: number, swimmerId: number) => {
    setSelectedSwimmers((prevSelected) => {
      const updatedSwimmers = [...prevSelected];
      updatedSwimmers[index] = swimmerId;
      return updatedSwimmers;
    });
  };

  const calculateRelay = async () => {
    const swimmerSet = new Set(selectedSwimmers);
    if (swimmerSet.size < selectedSwimmers.length) {
      return Alert.alert("Error", "You cannot select the same swimmer more than once.");
    }

    if (!selectedRelay){
      return Alert.alert("Error", "You have to select an event.");
    }
    const course = relayOptionMap[selectedRelay].course;
    const distance = relayOptionMap[selectedRelay].distance;

    try {
      const swimmerRelays = await Promise.all(
        selectedSwimmers.map((id) => database.getSwimmerRelay(id, course, distance))
      );
      const allSwimmerRelays = swimmerRelays.flat();
      const relay = makeRelay(allSwimmerRelays);
      setBestRelay(relay);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", String(error));;
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setBestRelay(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
        <Text style={styles.label}>SELECT RELAY</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(itemValue) => setSelectedRelay(itemValue)}
          value={selectedRelay}
          items={Object.keys(relayOptionMap).map((opt) => ({
            label: opt,
            value: opt
          }))}
          placeholder={{ label: 'Select an option', value: null }}
        />

        <View style={styles.gridContainer} lightColor={defaultLight} darkColor={defaultDark}>
          {[1, 2, 3, 4].map((id, index) => (
            <View key={index} style={styles.gridItem} lightColor={defaultLight} darkColor={defaultDark}>
              <Text style={styles.label}>SWIMMER #{id}</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                onValueChange={(itemValue) => handleSwimmerChange(index, itemValue)}
                value={selectedSwimmers[index]}
                placeholder={{ label: 'Select Swimmer', value: 0 }}
                items={swimmersList.map((swimmer) => ({
                  label: `${swimmer.name} (${gender[swimmer.gender]}, born in ${swimmer.year_of_birth})`,
                  value: swimmer.id
                }))}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.customButton} 
          onPress={calculateRelay} 
          disabled={selectedSwimmers.includes(0)}
        >
          <Text style={styles.buttonText}>CALCULATE RELAY</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.resultTitle}>BEST RELAY</Text>
            {bestRelay && (
               <View style={styles.resultContainer} lightColor={defaultLight} darkColor={defaultDark}>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Backstroke:</Text> {bestRelay.backstroke.name} - {timeToString(bestRelay.backstroke.time)}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Breaststroke:</Text> {bestRelay.breaststroke.name} - {timeToString(bestRelay.breaststroke.time)}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Butterfly:</Text> {bestRelay.butterfly.name} - {timeToString(bestRelay.butterfly.time)}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Freestyle:</Text> {bestRelay.freestyle.name} - {timeToString(bestRelay.freestyle.time)}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Total Time:</Text> {timeToString(bestRelay.totalTime)}
               </Text>
               <Text style={styles.resultText}>
                 <Text style={styles.resultLabel}>Age Group (Masters):</Text> {bestRelay.ageGroup}
               </Text>
             </View> 
            )}

            {!bestRelay && (
              <>
                <Text style={styles.resultText}>Not enough information</Text>
              </>
            )}
            <TouchableOpacity 
              style={styles.customButton} 
              onPress={closeModal}
            >
              <Text style={styles.buttonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: pickerText,
    borderRadius: 4,
    color: pickerText,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: pickerText,
    borderRadius: 8,
    color: pickerText,
    paddingRight: 30,
  },
  placeholder: {
    color: pickerText,
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Two columns
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultContainer: {
    width: '100%',
    padding: 10,
    alignItems: 'flex-start',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left',
  },
  resultLabel: {
    fontWeight: 'bold',
  },
  customButton: {
    borderRadius: 10, // Adjust this value for more or less rounding
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: defaultBlue, // You can change this to your desired color
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white', // Button text color
    fontSize: 16,
    fontWeight: 'bold'
  },
});

