import { StyleSheet, TextInput, View, useColorScheme } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const CustomTextInput = ({ placeholder, value, onPress }:any) => {
  const isDarkMode = useColorScheme()
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input,    {backgroundColor: isDarkMode === 'dark' ? "#1B1523" : 'white'},]}
          placeholder={placeholder}
          value={value}
          editable={false}
          placeholderTextColor={isDarkMode === 'dark'  ? "#FDFDFD" : "black"}

        />
        <Icon
          name="plus"
          size={16}
          color={isDarkMode === 'dark' ? "white" : 'black'}
          style={styles.plusIcon}
          onPress={onPress}
        />
      </View>
    );
  };
  export default CustomTextInput
  const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width:"100%",
        maxWidth:370,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        color: '#020202',
        marginLeft: 10,
        marginTop: 20,
    },
    plusIcon: {
      marginRight: 40,
      marginTop:20
    },
  });
  