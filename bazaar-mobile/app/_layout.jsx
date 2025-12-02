import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { PaperProvider } from 'react-native-paper';
import THEME from '../constants/theme';

export default function RootLayout() {
    return (
        <PaperProvider theme={THEME}>
            <AuthProvider>
                <CartProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </PaperProvider>
    );
}

