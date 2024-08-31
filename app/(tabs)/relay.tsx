import { Alert, Button, FlatList, Modal, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Swimmer, useDatabase } from '@/database/useDatabase';
import makeRelay, { Relay } from '@/utils/relayUtils';
import { Picker } from '@react-native-picker/picker';
import timeToString from '@/utils/timeToString';

const relayOptionMap: {[key:string]: {course:string, distance:number}} = {
  "4x50m Medley Relay (SCM)" : {course:"SCM", distance: 50},
  "4x50m Medley Relay (LCM)" : {course:"LCM", distance: 50},
  "4x100m Medley Relay (SCM)" : {course:"SCM", distance: 100},
  "4x100m Medley Relay (LCM)" : {course:"LCM", distance: 100}, 
}

export default function RelayScreen() {
  const [swimmersList, setSwimmersList] = useState<Swimmer[]> ([])
  const [selectedSwimmers, setSelectedSwimmers] = useState<number[]>([])
  const [bestRelay, setBestRelay] = useState<Relay | null>(null)
  const [selectedRelay, setSelectedRelay] = useState<string>("4x50m Medley Relay (SCM)");
  const [modalVisible, setModalVisible] = useState(false);

  const database = useDatabase()

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
  }, [])

  const handleSwimmerSelection = (swimmerId: number) => {
    setSelectedSwimmers(prevSelected => {
      if (prevSelected.includes(swimmerId)) {
        return prevSelected.filter(id => id !== swimmerId); // Deselect swimmer
      } else if (prevSelected.length < 4) {
        return [...prevSelected, swimmerId]; // Select swimmer
      }
      return prevSelected;
    })
  }

  const calculateRelay = async () => {
    if(selectedSwimmers.length !== 4){
      return Alert.alert('Please select exactly 4 swimmers.')
    } 

    const course = relayOptionMap[selectedRelay].course
    const distance = relayOptionMap[selectedRelay].distance 

    try {
      const swimmerRelays = await Promise.all(
        selectedSwimmers.map(id => database.getSwimmerRelay(id, course, distance))
      )
      const allSwimmerRelays = swimmerRelays.flat()
      const relay = makeRelay(allSwimmerRelays)
      setBestRelay(relay)
      setModalVisible(true)
    } catch (error) {
      console.log(error)
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    setBestRelay(null);
  };

  return (
    <View style={styles.container}>
      <Picker
        style={styles.picker}
        selectedValue={selectedRelay}
        placeholder='Select Relay'
        onValueChange={(itemValue) => setSelectedRelay(itemValue)}
      >
        {Object.keys(relayOptionMap).map((opt, index) => (
                    <Picker.Item key={index} label={opt} value={opt} />
                ))}
      </Picker>

      <Text style={styles.title}>Select 4 Swimmers</Text>
      <FlatList
        data={swimmersList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSwimmerSelection(item.id)}>
            <View
              style={[
                styles.swimmerItem,
                selectedSwimmers.includes(item.id) && styles.selectedSwimmer,
              ]}
            >
              <Text>{item.name} ({item.gender}, born {item.year_of_birth})</Text>
            </View>
          </Pressable>
        )}
      />

      <Button
        title="Calculate Relay"
        onPress={calculateRelay}
        disabled={selectedSwimmers.length !== 4}
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
                <Text>Age Group: {bestRelay.ageGroup}</Text>
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
  swimmerItem: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedSwimmer: {
    backgroundColor: '#d1e7dd',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
