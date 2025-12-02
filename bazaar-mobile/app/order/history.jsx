import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import orderService from '../../services/orderService';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function OrderHistoryScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderHistory();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED':
                return COLORS.success;
            case 'CANCELLED':
                return COLORS.error;
            case 'SHIPPED':
                return COLORS.info;
            case 'CONFIRMED':
                return COLORS.primary;
            default:
                return COLORS.warning;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'checkmark-circle';
            case 'CANCELLED':
                return 'close-circle';
            case 'SHIPPED':
                return 'airplane';
            case 'CONFIRMED':
                return 'checkmark-done';
            default:
                return 'time';
        }
    };

    const renderOrder = ({ item }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/order/${item.id}`)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.orderId}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.orderStatus) }]}>
                    <Ionicons name={getStatusIcon(item.orderStatus)} size={14} color={COLORS.white} />
                    <Text style={styles.statusText}>{item.orderStatus}</Text>
                </View>
            </View>

            <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>
                        {new Date(item.orderDate).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="cube-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.totalItem} items</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>₹{item.totalSellingPrice}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={{ width: 24 }} />
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={80} color={COLORS.gray300} />
                    <Text style={styles.emptyText}>No orders yet</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.md,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.textPrimary,
    },
    list: {
        padding: THEME.spacing.md,
    },
    orderCard: {
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        ...THEME.shadows.sm,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.sm,
    },
    orderId: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.textPrimary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.sm,
        paddingVertical: 4,
        borderRadius: THEME.borderRadius.sm,
    },
    statusText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        marginLeft: 4,
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.textSecondary,
        marginLeft: THEME.spacing.xs,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: THEME.spacing.sm,
    },
    totalLabel: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
    },
    totalAmount: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: THEME.spacing.xl,
    },
    emptyText: {
        fontSize: THEME.fontSize.lg,
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
    },
    shopButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: THEME.spacing.xl,
        paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
    },
    shopButtonText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
    },
});
