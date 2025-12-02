import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    const menuItems = [
        {
            icon: 'receipt-outline',
            title: 'Order History',
            onPress: () => router.push('/order/history'),
        },
        {
            icon: 'location-outline',
            title: 'Addresses',
            onPress: () => Alert.alert('Coming Soon', 'Address management coming soon'),
        },
        {
            icon: 'settings-outline',
            title: 'Settings',
            onPress: () => Alert.alert('Coming Soon', 'Settings coming soon'),
        },
        {
            icon: 'help-circle-outline',
            title: 'Help & Support',
            onPress: () => Alert.alert('Coming Soon', 'Help & Support coming soon'),
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color={COLORS.primary} />
                    </View>
                    <Text style={styles.name}>{user?.fullName || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || ''}</Text>
                </View>

                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name={item.icon} size={24} color={COLORS.textPrimary} />
                                <Text style={styles.menuItemText}>{item.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: THEME.spacing.md,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: THEME.fontSize.xxl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        padding: THEME.spacing.xl,
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    name: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.xs,
    },
    email: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
    },
    menuSection: {
        backgroundColor: COLORS.white,
        marginBottom: THEME.spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textPrimary,
        marginLeft: THEME.spacing.md,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        padding: THEME.spacing.md,
        marginHorizontal: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
        borderRadius: THEME.borderRadius.md,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    logoutText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.error,
        fontWeight: THEME.fontWeight.semibold,
        marginLeft: THEME.spacing.sm,
    },
});
