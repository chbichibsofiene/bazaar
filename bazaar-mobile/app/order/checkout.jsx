import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function CheckoutScreen() {
    const router = useRouter();
    const { cart } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');

    const [address, setAddress] = useState({
        name: '',
        mobile: '',
        adderss: '', // Note: backend uses 'adderss' (typo)
        locality: '',
        city: '',
        state: '',
        pincode: '',
    });

    const handlePlaceOrder = async () => {
        // Validate address
        if (!address.name || !address.mobile || !address.adderss || !address.city || !address.state || !address.pincode) {
            Alert.alert('Error', 'Please fill in all address fields');
            return;
        }

        try {
            setLoading(true);
            const response = await orderService.createOrder(address, paymentMethod);

            if (paymentMethod === 'STRIPE' && response.payment_link_url) {
                // For Stripe, you would open the payment link
                Alert.alert('Payment', 'Stripe payment integration coming soon');
            } else {
                Alert.alert('Success', 'Order placed successfully!', [
                    {
                        text: 'View Orders',
                        onPress: () => router.push('/order/history'),
                    },
                ]);
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={address.name}
                        onChangeText={(text) => setAddress({ ...address, name: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mobile Number"
                        value={address.mobile}
                        onChangeText={(text) => setAddress({ ...address, mobile: text })}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Address (House No, Building, Street)"
                        value={address.adderss}
                        onChangeText={(text) => setAddress({ ...address, adderss: text })}
                        multiline
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Locality / Area"
                        value={address.locality}
                        onChangeText={(text) => setAddress({ ...address, locality: text })}
                    />

                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="City"
                            value={address.city}
                            onChangeText={(text) => setAddress({ ...address, city: text })}
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="State"
                            value={address.state}
                            onChangeText={(text) => setAddress({ ...address, state: text })}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Pincode"
                        value={address.pincode}
                        onChangeText={(text) => setAddress({ ...address, pincode: text })}
                        keyboardType="number-pad"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            paymentMethod === 'CASH_ON_DELIVERY' && styles.paymentOptionActive,
                        ]}
                        onPress={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    >
                        <View style={styles.paymentLeft}>
                            <Ionicons name="cash-outline" size={24} color={COLORS.textPrimary} />
                            <Text style={styles.paymentText}>Cash on Delivery</Text>
                        </View>
                        {paymentMethod === 'CASH_ON_DELIVERY' && (
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            paymentMethod === 'STRIPE' && styles.paymentOptionActive,
                        ]}
                        onPress={() => setPaymentMethod('STRIPE')}
                    >
                        <View style={styles.paymentLeft}>
                            <Ionicons name="card-outline" size={24} color={COLORS.textPrimary} />
                            <Text style={styles.paymentText}>Pay with Stripe</Text>
                        </View>
                        {paymentMethod === 'STRIPE' && (
                            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Items ({cart?.totalItems || 0})</Text>
                        <Text style={styles.summaryValue}>₹{cart?.totalMrPrice || 0}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Discount</Text>
                        <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                            -₹{cart?.discount || 0}
                        </Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>₹{cart?.totalAmount || 0}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                            <Text style={styles.placeOrderText}>Place Order</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: COLORS.white,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.sm,
    },
    sectionTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.md,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: THEME.borderRadius.sm,
        padding: THEME.spacing.sm,
        fontSize: THEME.fontSize.md,
        marginBottom: THEME.spacing.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: THEME.borderRadius.sm,
        marginBottom: THEME.spacing.sm,
    },
    paymentOptionActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight + '20',
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textPrimary,
        marginLeft: THEME.spacing.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.sm,
    },
    summaryLabel: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
    },
    summaryValue: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textPrimary,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: THEME.spacing.sm,
        marginTop: THEME.spacing.sm,
    },
    totalLabel: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.textPrimary,
    },
    totalAmount: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.primary,
    },
    footer: {
        backgroundColor: COLORS.white,
        padding: THEME.spacing.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    placeOrderButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    placeOrderText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
        marginLeft: THEME.spacing.sm,
    },
});
