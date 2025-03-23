import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
} from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface InvestmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, amount: string) => void;
  isDark: boolean;
}

export default function InvestmentModal({ visible, onClose, onSubmit, isDark }: InvestmentModalProps) {
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [error, setError] = React.useState('');

  // Reset form when modal is closed
  useEffect(() => {
    if (!visible) {
      setName('');
      setAmount('');
      setError('');
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    
    if (!name.trim() || !amount.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onSubmit(name, amount);
    handleClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleClose}>
        <View style={[styles.container, !isDark && styles.lightContainer]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={isDark ? ['#2a2a2a', '#1a1a1a'] : ['#ffffff', '#f5f5f5']}
              style={styles.gradient}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={24} color={isDark ? '#fff' : '#1a1a1a'} />
              </TouchableOpacity>

              <Text style={[styles.title, !isDark && styles.lightTitle]}>Invest in Project</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Your Name</Text>
                <TextInput
                  style={[styles.input, !isDark && styles.lightInput]}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  value={name}
                  onChangeText={(text) => {
                    setError('');
                    setName(text);
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, !isDark && styles.lightLabel]}>Investment Amount (₹)</Text>
                <TextInput
                  style={[styles.input, !isDark && styles.lightInput]}
                  placeholder="Enter amount"
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => {
                    setError('');
                    setAmount(text);
                  }}
                />
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>Confirm Investment</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
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
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  gradient: {
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    marginTop: 24,
  },
  lightTitle: {
    color: '#1a1a1a',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#999',
    marginBottom: 8,
    fontSize: 14,
  },
  lightLabel: {
    color: '#666',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
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
  submitButton: {
    backgroundColor: '#00e6b8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});