import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Button, LogBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store/store';
import { I18nextProvider, useTranslation } from 'react-i18next'; // Import useTranslation
import i18next from 'i18next';
import 'intl-pluralrules';
import az from '../AwesomeProject/src/services/languages/az.json';
import en from '../AwesomeProject/src/services/languages/en.json';
import tr from '../AwesomeProject/src/services/languages/tr.json';
import ru from '../AwesomeProject/src/services/languages/ru.json';
import Navigator from './src/navigation/index';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LikedVacancyProvider } from './src/LikedVacanciesContext';
import { FavoriteProvider } from './src/FavoriteContext';
import { LikedCvProvider } from './src/LikedCvContex';
import withInternetCheck from './src/withInternetCheck';
import { SearchHistoryProvider } from './src/SearchHistoryContext';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'az',
  resources: {
    en: {
      translation: en,
    },
    az: {
      translation: az,
    },
    tr: {
      translation: tr,
    },
    ru: {
      translation: ru,
    },
    // Add more languages here
  },
});

const App = ({ isConnected }: any) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    });
  }, []);

  const { t } = useTranslation(); // Move useTranslation inside the component

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SearchHistoryProvider>
          <LikedCvProvider>
            <LikedVacancyProvider>
              <NavigationContainer>
                {/* Render the Navigator component */}
                <Navigator />
              </NavigationContainer>
              {/* Add the internet connectivity modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={!isConnected && showModal}
                onRequestClose={() => setShowModal(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>
                      {t('no_internet')}
                    </Text>
                    <Button title="Dismiss" onPress={() => setShowModal(false)} />
                  </View>
                </View>
              </Modal>
            </LikedVacancyProvider>
          </LikedCvProvider>
          </SearchHistoryProvider>
        </GestureHandlerRootView>
      </I18nextProvider>
    </Provider>
  );
};

export default withInternetCheck(App);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
  },
});