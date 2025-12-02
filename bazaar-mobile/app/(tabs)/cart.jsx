import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function CartScreen() {
    const router = useRouter();
    const { cart, loading, updateCartItem, removeFromCart } = useCart();

    const handleUpdateQuantity = async (cartItemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        try {
            await updateCartItem(cartItemId, { quantity: newQuantity });
        } catch (error) {
            Alert.alert('Error', 'Failed to update quantity');
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removeFromCart(cartItemId);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to remove item');
                        }
                    },
                },
            ]
        );
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.product.images?.[0] || 'https://via.placeholder.com/100' }}
                style={styles.productImage}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.product.title}
                </Text>
                {item.size && <Text style={styles.size}>Size: {item.size}</Text>}
                <Text style={styles.price}>₹{item.sellingPrice}</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                    >
                        <Ionicons name="remove" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                    >
                        <Ionicons name="add" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
            >
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
        </View>
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
                <Text style={styles.headerTitle}>Shopping Cart</Text>
            </View>

            {!cart || cart.cartItems?.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={COLORS.gray300} />
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart.cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.list}
                    />

                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>₹{cart.totalAmount}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() => router.push('/order/checkout')}
                        >
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
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
    list: {
        padding: THEME.spacing.md,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        ...THEME.shadows.sm,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: THEME.borderRadius.sm,
        backgroundColor: COLORS.gray100,
    },
    itemDetails: {
        flex: 1,
        marginLeft: THEME.spacing.md,
    },
    productTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.xs,
    },
    size: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.textSecondary,
        marginBottom: THEME.spacing.xs,
    },
    price: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.sm,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: THEME.borderRadius.sm,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantity: {
        marginHorizontal: THEME.spacing.md,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
    },
    removeButton: {
        padding: THEME.spacing.sm,
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
    footer: {
        backgroundColor: COLORS.white,
        padding: THEME.spacing.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    totalLabel: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
    },
    totalAmount: {
        fontSize: THEME.fontSize.xxl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.primary,
    },
    checkoutButton: {
        backgroundColor: COLORS.primary,
        padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
    },
});
