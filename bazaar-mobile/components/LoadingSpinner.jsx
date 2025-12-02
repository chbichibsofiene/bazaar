import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../constants/colors';
import THEME from '../constants/theme';

export default function LoadingSpinner({ size = 'large', color = COLORS.primary, text }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    text: {
        marginTop: THEME.spacing.md,
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
    },
});
