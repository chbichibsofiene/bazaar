import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import productService from '../../services/productService';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function HomeScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts({
                pageNumber: 0,
                pageSize: 20,
            });
            setProducts(response.content || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/product/list?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
        >
            <Image
                source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
                resizeMode="cover"
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

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Bazaar</Text>
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
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.productList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={64} color={COLORS.gray300} />
                        <Text style={styles.emptyText}>No products found</Text>
                    </View>
                }
            />
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
        color: COLORS.primary,
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
    productList: {
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
