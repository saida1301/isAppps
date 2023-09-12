import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, useColorScheme } from "react-native";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: string | undefined) => {
    i18n.changeLanguage(language);
  };
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={i18n.language}
        onValueChange={handleLanguageChange}
        style={[{ width: '100%', color: isDarkMode ? 'white' : 'black' }]}
      >
            <Picker.Item label="Az" value="az"  style={{ color: isDarkMode ? 'white' : 'black' }}  />
        <Picker.Item label="En" value="en" />
        <Picker.Item label="Tr" value="tr" />
        <Picker.Item label="Ru" value="ru" />
        {/* Add more languages here */}
      </Picker>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  pickerContainer: {
    width:"40%",
     marginVertical: 20,
     marginHorizontal: 20,
     borderWidth: 2,
     borderColor: '#8843E1',
     borderRadius: 12,
     flexDirection:"row",
 marginBottom:80
 
   },
})