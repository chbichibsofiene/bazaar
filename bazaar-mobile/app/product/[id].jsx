import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import productService from '../../services/productService';
import wishlistService from '../../services/wishlistService';
import { useCart } from '../../context/CartContext';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductById(id);
            setProduct(data);
            if (data.sizes) {
                const sizes = data.sizes.split(',');
                setSelectedSize(sizes[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedSize && product.sizes) {
            Alert.alert('Error', 'Please select a size');
            return;
        }

        try {
            await addToCart(product.id, selectedSize, quantity);
            Alert.alert('Success', 'Product added to cart');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to cart');
        }
    };

    const handleAddToWishlist = async () => {
        try {
            await wishlistService.addToWishlist(product.id);
            Alert.alert('Success', 'Product added to wishlist');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to wishlist');
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text>Product not found</Text>
            </View>
        );
    }

    const sizes = product.sizes ? product.sizes.split(',') : [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddToWishlist}>
                    <Ionicons name="heart-outline" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentImageIndex(index);
                    }}
                    scrollEventThrottle={16}
                >
                    {product.images?.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>

                <View style={styles.imageIndicator}>
                    {product.images?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentImageIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.details}>
                    <Text style={styles.title}>{product.title}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.sellingPrice}>₹{product.sellingPrice}</Text>
                        {product.mrpPrice > product.sellingPrice && (
                            <>
                                <Text style={styles.mrpPrice}>₹{product.mrpPrice}</Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{product.discountPercentage}% OFF</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {sizes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Select Size</Text>
                            <View style={styles.sizesContainer}>
                                {sizes.map((size) => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[
                                            styles.sizeButton,
                                            selectedSize === size && styles.sizeButtonActive,
                                        ]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <Text
                                            style={[
                                                styles.sizeText,
                                                selectedSize === size && styles.sizeTextActive,
                                            ]}
                                        >
                                            {size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Ionicons name="remove" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Ionicons name="add" size={20} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Seller</Text>
                        <Text style={styles.sellerName}>{product.seller?.sellerName || 'N/A'}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Ionicons name="cart-outline" size={20} color={COLORS.white} />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: THEME.spacing.md,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    content: {
        flex: 1,
    },
    productImage: {
        width: width,
        height: width,
        backgroundColor: COLORS.gray100,
    },
    imageIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: THEME.spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.gray300,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.primary,
    },
    details: {
        padding: THEME.spacing.md,
    },
    title: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.sm,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    sellingPrice: {
        fontSize: THEME.fontSize.xxl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginRight: THEME.spacing.sm,
    },
    mrpPrice: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
        textDecorationLine: 'line-through',
        marginRight: THEME.spacing.sm,
    },
    discountBadge: {
        backgroundColor: COLORS.success,
        paddingHorizontal: THEME.spacing.sm,
        paddingVertical: 4,
        borderRadius: THEME.borderRadius.sm,
    },
    discountText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
    },
    section: {
        marginBottom: THEME.spacing.lg,
    },
    sectionTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.sm,
    },
    sizesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sizeButton: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: THEME.borderRadius.sm,
        marginRight: THEME.spacing.sm,
        marginBottom: THEME.spacing.sm,
    },
    sizeButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    sizeText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textPrimary,
    },
    sizeTextActive: {
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.semibold,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: THEME.borderRadius.sm,
        borderWidth: 1,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: THEME.spacing.lg,
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
    },
    description: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    sellerName: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textPrimary,
    },
    footer: {
        padding: THEME.spacing.md,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
        marginLeft: THEME.spacing.sm,
    },
});
