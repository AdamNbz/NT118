import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TodoItemProps {
  icon: string;
  iconBgColor: string;
  title: string;
  description: string;
  count: number;
  countColor: string;
  onPress?: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  icon, 
  iconBgColor, 
  title, 
  description, 
  count, 
  countColor, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon as any} size={20} color="#fff" />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.countContainer}>
        <Text style={[styles.count, { color: countColor }]}>{count.toString().padStart(2, '0')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 92, 255, 0.05)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B1530',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#A29DBA',
    fontWeight: '500',
  },
  countContainer: {
    marginLeft: 12,
    backgroundColor: '#FAF7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  count: {
    fontSize: 18,
    fontWeight: '800',
  },
});

export default TodoItem;
