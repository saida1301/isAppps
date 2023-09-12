import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { borderRadius, spacing } from '../assets/themes';
import axios from 'axios';

const Companies = () => {
  const navigation = useNavigation();
  const [companies, setCompanies] = useState([]);
  const [companyVacancies, setCompanyVacancies] = useState({});

  function handlePress(companyId: any) {
    navigation.navigate('aboutCompanyMain', { companyId });
    console.log('slam1');
  }
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/companies`)
      .then(response => {
        setCompanies(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.4;
  const cardSpacing = 8;
  const containerWidth = cardWidth + cardSpacing * 2;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}>
      {companies.slice(0,10).map((company, index) => (
        <Pressable onPress={() => handlePress(company.id)} key={index}>
          <View>
            <LinearGradient
              colors={['#B298D3', '#652AB0']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              useAngle
              angle={180}
              style={{
                flex: 1,
                borderRadius: borderRadius.small,
                marginHorizontal: cardSpacing,
                paddingHorizontal: 20,
              }}>
              <View style={[styles.card, { width: containerWidth }]}>
                <View style={styles.box}>
                  <Image
                    source={{
                      uri: `https://1is.az/${company?.image}`,
                    }}
                    style={{
                      width: cardWidth,
                      height: 100, // Assuming aspect ratio of 16:9
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <View style={styles.text}>
                  <Text
                    style={{
                      flexShrink: 1,
                      color:   '#FFFFFF',
                      fontSize:12, fontWeight:"600", 
                        alignSelf:"center"
                    }}>
                    {company.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
  <Image
    source={require('AwesomeProject/src/assets/images/whitebag.png')}
    style={{ width: 15, height: 15 }}
  />
  <Text
    style={{
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 5, // Add some space between the image and text
    }}>
    {company.view}
  </Text>
</View>

                </View>
              </View>
            </LinearGradient>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default Companies;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.medium,
  },
  card: {
    height: 160,
    padding: 12,
    paddingHorizontal: 10,
  },
  box: {
    height: 100,
    backgroundColor: '#fff',
    top: 7,
    borderRadius: 5,
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },
});