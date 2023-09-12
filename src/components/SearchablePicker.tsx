import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, TextInput, Dimensions, useColorScheme, StyleSheet } from 'react-native';

const SearchablePicker = ({
  items,
  selectedValue,
  onValueChange,
  placeholder,
}) => {
  const [searchText, setSearchText] = useState('');
  const isDarkMode = useColorScheme() == 'dark';
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        style={[
          styles.textInput, // Add styles to the TextInput component
          {
            backgroundColor: isDarkMode ? '#1B1523' : 'white',
            color: isDarkMode ? 'white' : 'black',
          },
        ]}
      />
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{
          width: Dimensions.get('window').width * 0.42,
          borderColor: isDarkMode ? 'white' : 'black',
          borderWidth: 1,
          color: isDarkMode ? 'white' : 'black',
          backgroundColor: isDarkMode ? '#1B1523' : 'white',
          borderRadius: 20,
        }}
      >
        {filteredItems.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 8,
    marginBottom: 10,
  },
});

export default SearchablePicker;
