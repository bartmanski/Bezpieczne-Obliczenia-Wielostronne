import { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, FlatList, View, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

const getApiUrl = () => {
  if (Platform.OS === 'web') return '/api/chat';
  
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    // If it's a tunnel (ngrok), it usually needs 'http' or 'https'. 
    // Expo Go generally expects HTTP for the dev server unless configured otherwise.
    return `http://${hostUri}/api/chat`;
  }
  
  // Hard fallback for emulator if hostUri fails
  return 'http://10.0.2.2:8081/api/chat'; // Android Emulator localhost
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));
  
  // Initialize with a default, but allow user to change it
  const [serverUrl, setServerUrl] = useState(() => {
     const hostUri = Constants.expoConfig?.hostUri;
     return hostUri ? `http://${hostUri}/api/chat` : 'http://192.168.1.5:8081/api/chat';
  });
  
  const [debugInfo, setDebugInfo] = useState({ error: '' });
  const hasJoined = useRef(false);
  const insets = useSafeAreaInsets();

  const sendJoinMessage = async () => {
    try {
      await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `${username} joined the chat`,
          sender: 'System',
        }),
      });
      // We don't need to fetch immediately, the interval will pick it up or the next fetch
    } catch (e) { /* ignore join errors */ }
  };

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setDebugInfo({ error: '' });

        // If we successfully connected and haven't announced joining yet
        if (!hasJoined.current) {
            hasJoined.current = true;
            sendJoinMessage();
        }
      } else {
        setDebugInfo({ error: `Status: ${response.status}` });
      }
    } catch (error: any) {
      setDebugInfo({ error: 'Network Error' });
    }
  };

  // Poll for messages every 2 seconds
  useEffect(() => {
    hasJoined.current = false; // Reset join status when URL changes
    fetchMessages(); 
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [serverUrl]); // Re-start polling if URL changes

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          sender: username,
        }),
      });
      setInputText('');
      fetchMessages(); // Update immediately
    } catch (error) {
      alert('Failed to send. Check Server URL.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <ThemedText type="title">Global Chat</ThemedText>
        
        {/* Debug / Config Section */}
        <View style={{ width: '100%', marginTop: 10, padding: 5, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
            <Text style={{ fontSize: 10, color: '#555' }}>Server URL (Edit if needed):</Text>
            <TextInput 
                style={{ fontSize: 11, color: '#000', borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 2 }}
                value={serverUrl}
                onChangeText={setServerUrl}
                autoCapitalize="none"
                keyboardType="url"
            />
            {debugInfo.error ? (
                <Text style={{ color: 'red', fontSize: 10, marginTop: 2 }}>{debugInfo.error} - Check URL?</Text>
            ) : <Text style={{ color: 'green', fontSize: 10, marginTop: 2 }}>Connected</Text>}
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.sender === 'System') {
            return (
              <View style={styles.systemMessage}>
                <Text style={styles.systemMessageText}>{item.text}</Text>
              </View>
            );
          }
          return (
            <View style={[
              styles.messageBubble,
              item.sender === username ? styles.myMessage : styles.theirMessage
            ]}>
              <Text style={styles.senderName}>{item.sender}</Text>
              <Text style={[
                  styles.messageText, 
                  item.sender === username ? { color: '#fff' } : { color: '#000' }
              ]}>{item.text}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 100, // Extra space for input
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0a7ea4',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  senderName: {
    fontSize: 10,
    marginBottom: 2,
    color: '#888',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 10,
    opacity: 0.6,
  },
  systemMessageText: {
    fontSize: 12,
    color: '#333',
    fontStyle: 'italic',
  },
});
