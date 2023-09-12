import React, { useState } from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '../../assets/themes';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';

const SearchInput = ({ onSearch }: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CompanySearch');
  };
const {t} = useTranslation()
  const handleSearch = (query: React.SetStateAction<string>) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#0D0D0D' : '#F8F9FE',
            shadowColor: isDarkMode ? '#FFF' : '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.3 : 0.3,
            shadowRadius: isDarkMode ? 4 : 2,
            elevation: isDarkMode ? 5 : 2, 
            color: isDarkMode ? 'white' : 'black',
            textAlignVertical: 'center',
          },
        ]}
        placeholder={t('axtar')}
        placeholderTextColor={isDarkMode ? 'white' : 'black'}
        onChangeText={handleSearch}
        value={searchQuery}
        textAlign={'center'} // Set the cursor position to the right
      />
      <Icon name="search" size={20} color={isDarkMode ? colors.white : colors.black} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: spacing.medium,
    marginHorizontal: spacing.medium,
    top: 20,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.medium,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 40,
    top: '50%',
    transform: [{ translateY: -10 }],
    backgroundColor: 'transparent', // Make the background of the icon transparent
  },
});

export default SearchInput;
