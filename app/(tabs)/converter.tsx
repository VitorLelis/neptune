import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

/*
- **SCY to SCM**: Multiply the SCY time by approximately 1.11.
- **SCY to LCM**: Multiply the SCY time by approximately 1.10.
- **SCM to LCM**: Multiply the SCM time by approximately 1.02.
- **SCM to SCY**: Multiply the SCM time by approximately 0.89.
- **LCM to SCY**: Multiply the LCM time by approximately 0.90.
- **LCM to SCM**: Multiply the LCM time by approximately 0.98.
*/

export default function ConverterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Converter</Text>
      <Text>Convert the times</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
