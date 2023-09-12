import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import MyProfile from '../components/MyProfile'
import CustomHeader from '../components/CustomHeader'
import Total from '../components/Total'
import ProfileButons from '../components/ProfileButtons'

const ProfileScreen = () => {
  return (
    <ScrollView style={{width:"100%",}}>
   <ProfileButons/>


    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})