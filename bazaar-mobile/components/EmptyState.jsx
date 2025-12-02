import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import THEME from '../constants/theme';

export default function EmptyState({ icon = 'cube-outline', title, message, children }) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={80} color={COLORS.gray300} />
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            {children}
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
    title: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.textPrimary,
        marginTop: THEME.spacing.md,
        textAlign: 'center',
    },
    message: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.sm,
        textAlign: 'center',
    },
});
