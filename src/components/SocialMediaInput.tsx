import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Assuming the Icon component is already defined...

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', // Default background color for light mode
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginHorizontal:18
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#020202', // Default text color for light mode
    paddingVertical: 8,
  },
  darkContainer: {
    backgroundColor: '#1B1523', // Background color for dark mode
  },
  darkText: {
    color: 'white', // Text color for dark mode
  },
  darkPlaceholder: {
    color: 'white', // Placeholder text color for dark mode
  },
});

// Component
const SocialMediaInput = ({ isDarkMode, iconName, placeholder, value, onChangeText }) => {
  return (
    <View style={[styles.container, isDarkMode  && styles.darkContainer]}>
      <Icon
        name={iconName}
        size={24}
        color={isDarkMode ? 'white' : 'black'}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, isDarkMode  && styles.darkText]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? 'white' : 'black'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SocialMediaInput;