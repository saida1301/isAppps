import {ScrollView, StyleSheet, Text, View, useColorScheme} from 'react-native';
import React from 'react';

import terms from '../services/terms.json';
import teminat from '../services/teminat.json';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

const Policy = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const { t } = useTranslation();
  return (
    <ScrollView style={{marginBottom:"20%"}}>
      <Text
        style={{
          color: isDarkMode ? '#FFFFFF' : '#2E2C2C',
          alignSelf: 'center',
          fontWeight: '600',
          fontSize: 16,
          marginTop: 12,
        }}>
       {t('mexfi')}
      </Text>
      <Text style={{color: isDarkMode ? '#FDFDFD' : '#000000', fontSize: 14, marginLeft: 20, fontWeight:"600"}}>
      {t('mexfi_kom')}
      </Text>
      {terms.map(term => (
        <ScrollView>
          <View style={{marginHorizontal: 20}}>
            <View
              style={{
                backgroundColor:   isDarkMode ? '#0d0d0d' : '#E5EAFE',
                columnGap: 20,
                marginTop: 20,
                padding: 20,
              }}>
         <Text style={{ color: "#000000" }}>
  {t(
    i18n.language === 'az'
      ? term.content_az
      : i18n.language === 'en'
      ? term.content_en
      : i18n.language === 'tr'
      ? term.content_tr
      : i18n.language === 'ru'
      ? term.content_ru
      : ''
  )}
</Text>
            </View>
          </View>
        </ScrollView>
      ))}
      <Text style={{color: isDarkMode ? '#FDFDFD' : '#000000', fontSize: 14, marginLeft: 20, marginTop:12, fontWeight:"600"}}>
      {t('mexfi_prom')}
      </Text>
      {teminat.map(temin => (
        <ScrollView>
          <View style={{marginHorizontal: 20}}>
            <View
              style={{
                backgroundColor: '#E5EAFE',
                columnGap: 20,
                marginTop: 20,
                padding: 20,
              }}>
      <Text style={{ color: "#000000" }}>
  {t(
    i18n.language === 'az'
      ? temin.content_az
      : i18n.language === 'en'
      ? temin.content_en
      : i18n.language === 'tr'
      ? temin.content_tr
      : i18n.language === 'ru'
      ? temin.content_ru
      : ''
  )}
</Text>
            </View>
          </View>
        </ScrollView>
      ))}
    </ScrollView>
  );
};

export default Policy;

const styles = StyleSheet.create({});