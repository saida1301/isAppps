// Policy.js

import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import policy from "../services/policy.json";
import i18n from '../i18n';

const Terms = () => {
  const { t } = useTranslation(); // Hook to access translations
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <ScrollView style={{ marginBottom: '20%' }}>
      {policy.map((polic) => (
        <ScrollView key={polic.id}>
          <View style={{ marginHorizontal: 20 }}>
            <View
              style={{
                backgroundColor: isDarkMode  ? "#0d0d0d" :  "#E5EAFE",
                columnGap: 20,
                marginTop: 20,
                padding: 20
              }}
            >
<Text style={{ color: "#000000" }}>
  {t(
    i18n.language === 'az'
      ? polic.content_az
      : i18n.language === 'en'
      ? polic.content_en
      : i18n.language === 'tr'
      ? polic.content_tr
      : i18n.language === 'ru'
      ? polic.content_ru
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

export default Terms;