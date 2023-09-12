import {Linking, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import React from 'react';
import ContactForm from '../components/ContactForm';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { PhoneCall } from 'react-native-feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import HTMLrender from "react-native-render-html"
const ContactScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useTranslation();
  
  return (
    <ScrollView style={{  marginBottom:60, }}>

      <View>
        <Text
          style={{
            alignItems: 'center',
            textAlign: 'center',
            alignSelf: 'center',
            fontFamily: 'Poppins',
            fontWeight: '600',
            fontSize: 20,
            lineHeight: 30,
            color: isDarkMode ? 'white' : '#2E2C2C',
            marginBottom:20
          }}>
         {t('contact_info')}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins',
            fontWeight: '400',
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'center',
            color: isDarkMode ? '#C9C9C9' : '#1B1B1B',
          }}>
           {t('contact')}
        </Text>
      </View>

      <View>
      <View style={{ paddingVertical: 20 }}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,

    }}
  >
 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* Phone icon */}
      <PhoneCall width={24} height={24} color={isDarkMode ? '#FFFFFF' : '#2E2C2C'} />
      
      {/* Phone number text */}
      <Text style={{ color: isDarkMode ? '#FFFFFF' : '#2E2C2C', marginLeft: 5 }}>
        +994 (12) 564 76 60
      </Text>
    </View>
    <TouchableOpacity
  onPress={() => Linking.openURL('https://www.facebook.com/1ish.az/')}
  style={{
    width: 50,
    height: 50,
    backgroundColor: '#1B1B1B',
    borderRadius: 25,
    marginRight: -12,
  }}
>
  <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
    <Icon name="facebook" size={24} color="white" />
  </View>
</TouchableOpacity>

  </View>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,

    }}
  >
     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
   <MaterialCommunityIcons name="email" size={30} color={isDarkMode ? '#FFFFFF' : '#2E2C2C'} />
    <Text style={{ color: isDarkMode ? '#FFFFFF' : '#2E2C2C'}}>info@butagrup.az</Text>
    </View>
    <TouchableOpacity
  onPress={() => Linking.openURL('https://www.instagram.com/1is_az/')}
  style={{
    width: 50,
    height: 50,
    backgroundColor: '#1B1B1B',
    borderRadius: 25,
    marginRight: -13,
  }}
>
  <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
    <Icon name="instagram" size={24} color="white" />
  </View>
</TouchableOpacity>
  </View>
  <View
    style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    marginBottom: 20,
 }}
  >
     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Entypo name="location-pin" size={30} color={isDarkMode ? '#FFFFFF' : '#2E2C2C'} />
   <Text style={{ color: isDarkMode ? '#FFFFFF' : '#2E2C2C'}}>
  {t('contact_map').split(', ').map((line, index) => (
    <React.Fragment key={index}>
      {index > 0 && <Text>,{'\n'}</Text>}
      <Text>{line}</Text>
    </React.Fragment>
  ))}
</Text>
</View>

    <TouchableOpacity
  onPress={() => Linking.openURL('https://www.linkedin.com/company/recruitment-azerbaycan/')}
  style={{
    width: 50,
    height: 50,
    backgroundColor: '#1B1B1B',
    borderRadius: 25,
    marginRight: -10,
  }}
>
  <View style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
    <Icon name="linkedin" size={24} color="white" />
  </View>
</TouchableOpacity>
  </View>
</View>

        <View
          style={{
            padding: 12,
            backgroundColor: '#8843E1',
          }}>
<Text style={{ color: '#F4F9FD', lineHeight: 20, alignSelf: 'center' }}>
  <Text>{t('contact1')}</Text>
  {'\n'}
  <Text>{t('contact2')}</Text>
  {'\n'}
  <Text>{t('contact3')}</Text>
  {'\n'}
  <Text>{t('contact4')}</Text>
  {'\n'}

    <HTMLrender source={{ html: t('contact5') }} />

</Text>


        </View>
      </View>

      <ContactForm />
    </ScrollView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    fontWeight: '600',
    fontSize: 20,
    color: '#2E2C2C',
  },
});