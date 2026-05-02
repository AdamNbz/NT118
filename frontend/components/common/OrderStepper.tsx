import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderStatus } from '../../lib/orderApi';

interface Step {
  id: OrderStatus;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { id: 'pending', label: 'Đặt hàng', icon: 'receipt-outline' },
  { id: 'confirmed', label: 'Xác nhận', icon: 'checkmark-circle-outline' },
  { id: 'shipping', label: 'Đang giao', icon: 'truck-outline' },
  { id: 'delivered', label: 'Thành công', icon: 'gift-outline' },
];

interface OrderStepperProps {
  currentStatus: OrderStatus;
}

const OrderStepper: React.FC<OrderStepperProps> = ({ currentStatus }) => {
  const getStatusIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    if (status === 'refunded') return -1;
    return STEPS.findIndex(s => s.id === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  if (currentIndex === -1) return null;

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View style={[styles.circle, isCompleted && styles.activeCircle]}>
                <Ionicons 
                  name={step.icon as any} 
                  size={16} 
                  color={isCompleted ? '#FFF' : '#A29DBA'} 
                />
              </View>
              <Text style={[styles.label, isCompleted && styles.activeLabel]}>
                {step.label}
              </Text>
            </View>
            {!isLast && (
              <View style={[styles.line, index < currentIndex && styles.activeLine]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginVertical: 10,
  },
  stepContainer: {
    alignItems: 'center',
    width: 60,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeCircle: {
    backgroundColor: '#F73658',
  },
  label: {
    fontSize: 10,
    color: '#A29DBA',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#1B1530',
    fontWeight: '600',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#F1F5FF',
    marginTop: -20,
  },
  activeLine: {
    backgroundColor: '#F73658',
  },
});

export default OrderStepper;
