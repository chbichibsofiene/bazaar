import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

const CATEGORIES = [
    { id: 'electronics', name: 'Electronics', image: 'https://via.placeholder.com/150' },
    { id: 'fashion', name: 'Fashion', image: 'https://via.placeholder.com/150' },
    { id: 'home', name: 'Home & Kitchen', image: 'https://via.placeholder.com/150' },
    { id: 'beauty', name: 'Beauty', image: 'https://via.placeholder.com/150' },
    { id: 'sports', name: 'Sports', image: 'https://via.placeholder.com/150' },
    { id: 'books', name: 'Books', image: 'https://via.placeholder.com/150' },
];

export default function CategoriesScreen() {
    const router = useRouter();

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => router.push(`/product/list?category=${item.id}`)}
        >
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Categories</Text>
            </View>
            <FlatList
                data={CATEGORIES}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
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
    list: {
        padding: THEME.spacing.sm,
    },
    categoryCard: {
        flex: 1,
        margin: THEME.spacing.sm,
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.md,
        ...THEME.shadows.sm,
        overflow: 'hidden',
        alignItems: 'center',
        padding: THEME.spacing.md,
    },
    categoryImage: {
        width: 100,
        height: 100,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.sm,
    },
    categoryName: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
});
