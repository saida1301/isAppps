import React, {useState} from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input} from '.';
import style from './style';

const PassWordInput = (props: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <React.Fragment>
        <View style={{position:"relative"}}>
      <Input
        secureTextEntry={!isPasswordVisible}

        placeholder="Password"
        placeholderTextColor="#000"

        style={style.inputStyle}
        ></Input>

<View style={ {position: 'absolute', right: 0, top: '50%', transform: [{translateY: -25}]}
}>
<TouchableOpacity
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        style={{paddingHorizontal: 10}}>
        <MaterialCommunityIcons
          name={isPasswordVisible ? 'eye-off' : 'eye'}
          size={24}
          color="gray"
        />
      </TouchableOpacity>
</View>
      </View>
    </React.Fragment>
  );
};

export default PassWordInput;
