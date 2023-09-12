import { StyleSheet, Text, TextInput, TextStyle, View, TextInputProps, ViewProps } from "react-native";
import React from "react";
import { borderRadius, colors, fontSizes, spacing } from "../../assets/themes";
interface InputProps extends   ViewProps {
    labelShow?: boolean,
    label?: string,

    error?: string | null,
    leftIcon?: any,
}

export const Input = ({  labelShow = false, error = null, label = "Input label", ...props }: InputProps) => {
    return (
        <>
            {labelShow ?
                <View><Text>{label}</Text></View>
                : null
            }
            <TextInput
                style={{
                
                    borderRadius: borderRadius.small,
                    fontSize: fontSizes.medium,
                    borderColor: colors.black + '60',
                    borderWidth: 1,
         color:"black",
                    paddingHorizontal: spacing.medium,
                }}
                {...props}
            />
            <Text style={{
                color: 'red'
            }}>{error}</Text>
        </>
    );
};

