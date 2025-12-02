import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export default function StarRating({ rating, size = 16, color = COLORS.warning }) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <Ionicons key={i} name="star" size={size} color={color} />
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <Ionicons key={i} name="star-half" size={size} color={color} />
            );
        } else {
            stars.push(
                <Ionicons key={i} name="star-outline" size={size} color={color} />
            );
        }
    }

    return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
