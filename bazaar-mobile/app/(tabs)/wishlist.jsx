import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import wishlistService from '../../services/wishlistService';
import { useCart } from '../../context/CartContext';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function WishlistScreen() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getWishlist();
            setWishlist(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product.id, product.sizes?.split(',')[0] || 'M', 1);
            Alert.alert('Success', 'Product added to cart');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to cart');
        }
    };

    const renderWishlistItem = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
        >
            <Image
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.price}>₹{item.sellingPrice}</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                >
                    <Ionicons name="cart-outline" size={16} color={COLORS.white} />
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
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
                <Text style={styles.headerTitle}>Wishlist</Text>
            </View>

            {!wishlist || wishlist.products?.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color={COLORS.gray300} />
                    <Text style={styles.emptyText}>Your wishlist is empty</Text>
                </View>
            ) : (
                <FlatList
                    data={wishlist.products}
                    renderItem={renderWishlistItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
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
        padding: THEME.spacing.sm,
    },
    productCard: {
        flex: 1,
        margin: THEME.spacing.sm,
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.md,
        ...THEME.shadows.sm,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: 180,
        backgroundColor: COLORS.gray100,
    },
    productInfo: {
        padding: THEME.spacing.sm,
    },
    productTitle: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.xs,
    },
    price: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.sm,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: THEME.spacing.sm,
        borderRadius: THEME.borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        marginLeft: THEME.spacing.xs,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: THEME.fontSize.lg,
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.md,
    },
});
