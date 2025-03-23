import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, User, Wallet } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useInvestments } from '@/context/InvestmentsContext';
import { LinearGradient } from 'expo-linear-gradient';

// Project data mapping (you can move this to a separate file)
const projectImages: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
  '2': 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800',
  '3': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
  '4': 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800',
};

export default function InvestmentForm() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { projectId, projectName } = useLocalSearchParams();
  const { addInvestment } = useInvestments();
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !amount.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Add the investment to the context
    addInvestment({
      projectId,
      projectName: projectName as string,
      amount: amountNum,
      image: projectImages[projectId as string] || projectImages['1'], // Fallback to first image
    });
    
    // Navigate back to the project details
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <LinearGradient
        colors={isDark ? ['#00e6b8', '#1a1a1a'] : ['#00e6b8', '#ffffff']}
        style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <ArrowLeft size={24} color={isDark ? '#fff' : '#1a1a1a'} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, !isDark && styles.lightText]}>Investment Details</Text>
          </View>

          <View style={styles.content}>
            <View style={[styles.card, !isDark && styles.lightCard]}>
              <Text style={[styles.projectName, !isDark && styles.lightProjectName]}>
                {projectName}
              </Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <User size={20} color="#00e6b8" />
                    <Text style={[styles.label, !isDark && styles.lightLabel]}>Investor Name</Text>
                  </View>
                  <TextInput
                    style={[styles.input, !isDark && styles.lightInput]}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDark ? '#666' : '#999'}
                    value={name}
                    onChangeText={(text) => {
                      setError('');
                      setName(text);
                    }}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <Wallet size={20} color="#00e6b8" />
                    <Text style={[styles.label, !isDark && styles.lightLabel]}>Investment Amount</Text>
                  </View>
                  <TextInput
                    style={[styles.input, !isDark && styles.lightInput]}
                    placeholder="Enter amount in ₹"
                    placeholderTextColor={isDark ? '#666' : '#999'}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={(text) => {
                      setError('');
                      setAmount(text);
                    }}
                  />
                </View>

                <View style={styles.paymentSection}>
                  <View style={styles.inputHeader}>
                    <CreditCard size={20} color="#00e6b8" />
                    <Text style={[styles.label, !isDark && styles.lightLabel]}>Payment Method</Text>
                  </View>
                  <View style={[styles.paymentCard, !isDark && styles.lightPaymentCard]}>
                    <Text style={[styles.paymentText, !isDark && styles.lightPaymentText]}>
                      UPI / Net Banking
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>Confirm Investment</Text>
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                By confirming, you agree to our terms and conditions for project investments.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  lightText: {
    color: '#1a1a1a',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(42, 42, 42, 0.8)',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  projectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  lightProjectName: {
    color: '#1a1a1a',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
    fontSize: 14,
  },
  formSection: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  lightLabel: {
    color: '#666',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lightInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    color: '#1a1a1a',
  },
  paymentSection: {
    gap: 8,
  },
  paymentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lightPaymentCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  paymentText: {
    color: 'white',
    fontSize: 16,
  },
  lightPaymentText: {
    color: '#1a1a1a',
  },
  submitButton: {
    backgroundColor: '#00e6b8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});