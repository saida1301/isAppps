import { Text, TextStyle, TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from '@react-navigation/native';

import { colors, fontSizes, fontWeights, spacing } from "../assets/themes";

type NavigateToType = {
    title: string,
    navigateTo?: string,
    textStyle?: TextStyle,
    showUndeline?: boolean,
    pressableStyle?: StyleProp<ViewStyle>
}

const NavigateTo = (props: NavigateToType) => {
    const navigation = useNavigation<any>();
    return (
        <TouchableOpacity style={props.pressableStyle} onPress={() => navigation.navigate(props.navigateTo)}>
            <Text style={{
                   fontSize: fontSizes.medium,
                   alignSelf:"center",
                   fontWeight:fontWeights.bold,
                   color:"#8843E1" || colors.black,
                   paddingVertical:spacing.medium,
                   ...{
                    textDecorationLine: props.showUndeline ? 'underline' : 'none',

                }, ...props.textStyle
            }}>{props.title}</Text>
        </TouchableOpacity>
    );
};

export default NavigateTo;