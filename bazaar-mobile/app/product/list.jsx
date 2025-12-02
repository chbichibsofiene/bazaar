import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import productService from '../../services/productService';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function ProductListScreen() {
    const { query, category } = useLocalSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(query || '');

    useEffect(() => {
        fetchProducts();
    }, [category, query]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let data;

            if (query) {
                data = await productService.searchProducts(query);
            } else {
                const filters = {};
                if (category) filters.category = category;
                const response = await productService.getAllProducts(filters);
                data = response.content || [];
            }

            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                const data = await productService.searchProducts(searchQuery);
                setProducts(data);
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderProduct = ({ item }) => (
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
                <View style={styles.priceContainer}>
                    <Text style={styles.sellingPrice}>₹{item.sellingPrice}</Text>
                    {item.mrpPrice > item.sellingPrice && (
                        <>
                            <Text style={styles.mrpPrice}>₹{item.mrpPrice}</Text>
                            <Text style={styles.discount}>{item.discountPercentage}% OFF</Text>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {category ? 'Category' : query ? 'Search Results' : 'Products'}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color={COLORS.gray400} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={64} color={COLORS.gray300} />
                            <Text style={styles.emptyText}>No products found</Text>
                        </View>
                    }
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
    searchContainer: {
        padding: THEME.spacing.md,
        backgroundColor: COLORS.white,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray100,
        borderRadius: THEME.borderRadius.md,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: THEME.spacing.sm,
        fontSize: THEME.fontSize.md,
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
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    sellingPrice: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginRight: THEME.spacing.xs,
    },
    mrpPrice: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.textSecondary,
        textDecorationLine: 'line-through',
        marginRight: THEME.spacing.xs,
    },
    discount: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.success,
        fontWeight: THEME.fontWeight.semibold,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: THEME.spacing.xxl,
    },
    emptyText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
        marginTop: THEME.spacing.md,
    },
});
