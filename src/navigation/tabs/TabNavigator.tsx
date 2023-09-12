import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faBook,
  faBookOpen,
  faFile,
  faHeart,
  faHouse,
  faMessage,
  faPeopleArrows,
  faPeopleCarry,
  faPeopleGroup,
  faPeopleLine,
  faPeopleRoof,
} from '@fortawesome/free-solid-svg-icons';

import {useNavigation} from '@react-navigation/native';
import {colors} from '../../assets/themes';
import TelimMainScreen from '../../screens/TelimMainScreen';
import CvCarusel from '../../components/CvCarusel';
import LinearGradient from 'react-native-linear-gradient';
import VacanciesScreen from '../../screens/VacanciesScreen';
import CompanyList from '../../screens/CompanyList';
import CvScreen from '../../screens/CvScreen';
import BlogScreen from '../../screens/BlogScreen';
import CompanyStack from '../stack/CompanyStack';
import VacancyStack from '../stack/VacancyStack';
import TelimStack from '../stack/TelimStack';
import CvStack from '../stack/CvStack';
import HomeSctack from '../stack/HomeSctack';
import BlogStack from '../stack/BlogStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import TabIcon from '../../components/TabIcon';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();
const {t} = useTranslation()
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#fff',
          tabBarStyle: {
            position: 'absolute',
            height: 60,
            shadowColor: 'transparent',
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={['#9467CD', '#8551C8', '#753AC2']}
              start={{x: 0, y: 0}}
              useAngle
              angle={92}
              end={{x: 1, y: 1}}
              style={{
                height: 70,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            />
          ),
        }}>
        <Tab.Screen
          name="Home"
          component={HomeSctack}
          options={({route}) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                iconName="home"
                title={t('home')}
              />
            ),
  
          })}
        />
<Tab.Screen
  name="Telim"
  component={VacancyStack}
  options={({ route }) => ({
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.push('Tabs')}>
        <Image
          source={require('AwesomeProject/src/assets/images/telim.png')}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    ),
    headerShown: false,
    tabBarShowLabel: false,
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: 'center' }}>
        <Image
          source={
            focused
              ? require('AwesomeProject/src/assets/images/doc-solid.png')
              : require('AwesomeProject/src/assets/images/doc-light.png')
          }
          style={{ width: 24, height: 24 }}
        />
        <Text style={{ color: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.70)', fontSize: 10, fontWeight: "500", marginTop: 6 }}>{t('work')}</Text>
      </View>
    ),
    
  })}
/>


        <Tab.Screen
          name="CV"
          component={CompanyStack}
          options={({route}) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.push('Tabs')}>
                   <Image
              source={require('AwesomeProject/src/assets/images/users-solid.png')}
              style={{width:24, height:24}}
            />
              </TouchableOpacity>
            ),
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center' }}>
         
                <Image
                  source={
                    focused
                      ? require('AwesomeProject/src/assets/images/buildingfill.png')
                      : require('AwesomeProject/src/assets/images/buildingnew.png')
                  }
                  style={{ width: 24, height: 24 }}
                />
                           <Text style={{ color: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.70)', fontSize: 10, fontWeight: "500", marginTop: 6 }}>{t('sirketler')}</Text>
              </View>
            ),
          })}
        />
        <Tab.Screen
          name="Vacancies"
          component={CvStack}
          options={({route}) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.push('Tabs')}>
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            ),
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center' }}>
         
                <Image
                  source={
                    focused
                      ? require('AwesomeProject/src/assets/images/users-solid.png')
                      : require('AwesomeProject/src/assets/images/users-light.png')
                  }
                  style={{ width: 24, height: 24 }}
                />
                          <Text style={{ color: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.70)', fontSize: 10, fontWeight: "500", marginTop: 6 }}>{t('job_seekers')}</Text>
              </View>
            ),
          })}
        />

        <Tab.Screen
          name="Companies"
          component={TelimStack}
          options={({route}) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.push('Tabs')}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            ),
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center' }}>
         
                <Image
                  source={
                    focused
                      ? require('AwesomeProject/src/assets/images/telimfill.png')
                      : require('AwesomeProject/src/assets/images/telim.png')
                  }
                  style={{ width: 24, height: 24 }}
                />
                          <Text style={{ color: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.70)', fontSize: 10, fontWeight: "500", marginTop: 6 }}>{t('trainings')} </Text>
              </View>
            ),
          })}
        />
        <Tab.Screen
          name="Blog"
          component={BlogStack}
          options={({route}) => ({
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.push('Tabs')}>
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            ),
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center' }}>
         
                <Image
                  source={
                    focused
                      ? require('AwesomeProject/src/assets/images/book-open-solid.png')
                      : require('AwesomeProject/src/assets/images/book-open-light.png')
                  }
                  style={{ width: 24, height: 24 }}
                />
                          <Text style={{ color: focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.70)', fontSize: 10, fontWeight: "500", marginTop: 6 }}>{t('blogs')}</Text>
              </View>
            ),
          })}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabIconActive: {
    color: colors.primary,
  },
  tabIconInactive: {
    color: colors.white,
  },
});

export default TabNavigator;
