import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../constants/colors';
import THEME from '../../constants/theme';

export default function LoginScreen() {
    const router = useRouter();
    const { login, sendOtp } = useAuth();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            await sendOtp(email);
            setOtpSent(true);
            Alert.alert('Success', 'OTP sent to your email');
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }

        try {
            setLoading(true);
            await login(email, otp);
            // Navigation is handled by AuthLayout
        } catch (error) {
            Alert.alert('Error', error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Welcome to Bazaar</Text>
                    <Text style={styles.subtitle}>Login to continue shopping</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!otpSent}
                        />

                        {!otpSent ? (
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.buttonText}>Send OTP</Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <>
                                <Text style={styles.label}>Enter OTP</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />

                                <TouchableOpacity
                                    style={[styles.button, loading && styles.buttonDisabled]}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={COLORS.white} />
                                    ) : (
                                        <Text style={styles.buttonText}>Login</Text>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.resendButton}
                                    onPress={() => {
                                        setOtpSent(false);
                                        setOtp('');
                                    }}
                                >
                                    <Text style={styles.resendText}>Change Email</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: THEME.spacing.lg,
        justifyContent: 'center',
    },
    title: {
        fontSize: THEME.fontSize.xxxl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
        marginBottom: THEME.spacing.xl,
    },
    form: {
        marginBottom: THEME.spacing.xl,
    },
    label: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.medium,
        color: COLORS.textPrimary,
        marginBottom: THEME.spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md,
        fontSize: THEME.fontSize.md,
        marginBottom: THEME.spacing.md,
        backgroundColor: COLORS.white,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.md,
        alignItems: 'center',
        marginTop: THEME.spacing.md,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
    },
    resendButton: {
        alignItems: 'center',
        marginTop: THEME.spacing.md,
    },
    resendText: {
        color: COLORS.primary,
        fontSize: THEME.fontSize.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.textSecondary,
    },
    linkText: {
        fontSize: THEME.fontSize.md,
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.semibold,
    },
});
