import { Alert, Button, Modal, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Swimmer, useDatabase } from '@/database/useDatabase';
import makeRelay, { Relay } from '@/utils/relayUtils';
import { Picker } from '@react-native-picker/picker';
import timeToString from '@/utils/timeToString';
import { useFocusEffect } from 'expo-router';
import React from 'react';

const relayOptionMap: { [key: string]: { course: string, distance: number } } = {
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
      console.log(error);
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

  // Update swimmer selection by index
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
      Alert.alert("Error", "You cannot select the same swimmer more than once.");
      return;
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
      console.log(error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setBestRelay(null);
  };

  return (
    <View style={styles.container}>
      <Picker
        style={styles.picker}
        selectedValue={selectedRelay}
        onValueChange={(itemValue) => setSelectedRelay(itemValue)}
      >
        {Object.keys(relayOptionMap).map((opt, index) => (
          <Picker.Item key={index} label={opt} value={opt} />
        ))}
      </Picker>

      <Text style={styles.title}>Select 4 Swimmers for Relay</Text>

      {[1,2,3,4].map((id, index) => (
        <View key={index} style={styles.pickerContainer}>
          <Text style={styles.label}>Swimmer #{id}</Text>
          <Picker
            style={styles.picker}
            selectedValue={selectedSwimmers[index]}
            onValueChange={(itemValue) => handleSwimmerChange(index, itemValue)}
          >
            <Picker.Item label="Select Swimmer" value={0} />
            {swimmersList.map((swimmer) => (
              <Picker.Item key={swimmer.id} label={`${swimmer.name} (${swimmer.gender}, born ${swimmer.year_of_birth})`} value={swimmer.id} />
            ))}
          </Picker>
        </View>
      ))}

      <Button
        title="Calculate Relay"
        onPress={calculateRelay}
        disabled={selectedSwimmers.includes(0)}
      />

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.resultTitle}>Best Relay</Text>
            {bestRelay && (
              <>
                <Text>Backstroke: {bestRelay.backstroke.name} - {timeToString(bestRelay.backstroke.time)}</Text>
                <Text>Breaststroke: {bestRelay.breaststroke.name} - {timeToString(bestRelay.breaststroke.time)}</Text>
                <Text>Butterfly: {bestRelay.butterfly.name} - {timeToString(bestRelay.butterfly.time)}</Text>
                <Text>Freestyle: {bestRelay.freestyle.name} - {timeToString(bestRelay.freestyle.time)}</Text>
                <Text>Total Time: {timeToString(bestRelay.totalTime)}</Text>
                <Text>Age Group for Masters: {bestRelay.ageGroup}</Text>
              </>
            )}

            {!bestRelay && (
              <>
                <Text>Not enough information</Text>
              </>
            )}
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
