import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare, Plus, Send, Bot, X, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Simple chatbot patterns and responses
const chatbotPatterns = [
  {
    pattern: /(invest|investing|investment)/i,
    response: "Based on current market trends, green energy investments show strong potential. Consider diversifying across solar, wind, and hydroelectric sectors for optimal returns."
  },
  {
    pattern: /(risk|risks|risky)/i,
    response: "Every investment carries risks. I recommend analyzing the project's track record, team expertise, and market conditions. Would you like specific risk assessment factors to consider?"
  },
  {
    pattern: /(return|returns|roi)/i,
    response: "Green energy projects typically show ROI between 8-15% annually. Solar projects often have faster payback periods compared to wind energy investments."
  },
  {
    pattern: /(sustainable|sustainability|esg)/i,
    response: "ESG metrics are crucial for sustainable investments. Look for projects with transparent environmental impact reporting and strong governance frameworks."
  },
  {
    pattern: /(market|markets|trend)/i,
    response: "Current market trends show increasing institutional investment in renewable energy. Government policies and carbon pricing are key drivers to watch."
  },
  {
    pattern: /(help|advice|suggest)/i,
    response: "I can help you analyze investment opportunities. Would you like to know about specific sectors or general investment strategies?"
  }
];

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
}

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: Date;
}

export default function CommunityScreen() {
  const { isDark } = useTheme();
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your investment advisor. How can I help you today?",
      isBot: true
    }
  ]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Alex Johnson',
      title: 'Fixing Potholes in Downtown',
      content: 'Let\'s organize a weekend pothole repair drive and request city assistance.',
      likes: 56,
      comments: 4,
      timestamp: new Date()
    },
    {
      id: '2',
      author: 'Samantha Lee',
      title: 'Community Cleanup Initiative',
      content: 'Plan a cleanup day for the local park and invite volunteers.',
      likes: 102,
      comments: 25,
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isBot: false
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Generate bot response
    let botResponse = "I'm not sure about that. Could you rephrase your question about investments or sustainability?";

    // Check against patterns
    for (const pattern of chatbotPatterns) {
      if (pattern.pattern.test(chatInput)) {
        botResponse = pattern.response;
        break;
      }
    }

    // Add bot response with a slight delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true
      }]);
    }, 500);

    setChatInput('');
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0,
      timestamp: new Date()
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '' });
    setShowNewPost(false);
  };

  return (
    <SafeAreaView style={[styles.container, !isDark && styles.lightContainer]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, !isDark && styles.lightTitle]}>Community</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.newsScroll}>
          <View style={[styles.newsCard, !isDark && styles.lightNewsCard]}>
            <Text style={[styles.newsTitle, !isDark && styles.lightNewsTitle]}>
              Strengthening Our Presence in Renewable Energies
            </Text>
            <Text style={styles.newsSource}>TotalEnergies.com</Text>
          </View>
        </ScrollView>

        <View style={styles.discussionsSection}>
          <Text style={[styles.sectionTitle, !isDark && styles.lightSectionTitle]}>
            Community Discussions
          </Text>

          {posts.map((post, index) => (
            <Animated.View
              key={post.id}
              entering={FadeInDown.delay(index * 100).springify()}
              style={[styles.discussionCard, !isDark && styles.lightDiscussionCard]}>
              <View style={styles.discussionIcon}>
                <MessageSquare size={24} color="#00e6b8" />
              </View>
              <View style={styles.discussionContent}>
                <Text style={[styles.discussionTitle, !isDark && styles.lightDiscussionTitle]}>
                  {post.title}
                </Text>
                <Text style={[styles.discussionAuthor, !isDark && styles.lightDiscussionAuthor]}>
                  by {post.author}
                </Text>
                <Text style={[styles.discussionDescription, !isDark && styles.lightDiscussionDescription]}>
                  {post.content}
                </Text>
                <View style={styles.discussionStats}>
                  <Text style={[styles.statText, !isDark && styles.lightStatText]}>❤️ {post.likes}</Text>
                  <Text style={[styles.statText, !isDark && styles.lightStatText]}>💬 {post.comments}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* New Post Modal */}
      {showNewPost && (
        <Animated.View 
          entering={FadeInUp.springify()}
          style={[styles.modal, !isDark && styles.lightModal]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, !isDark && styles.lightModalTitle]}>Create Post</Text>
            <TouchableOpacity onPress={() => setShowNewPost(false)}>
              <X size={24} color={isDark ? '#fff' : '#1a1a1a'} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, !isDark && styles.lightInput]}
            placeholder="Post Title"
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={newPost.title}
            onChangeText={text => setNewPost(prev => ({ ...prev, title: text }))}
          />
          <TextInput
            style={[styles.textArea, !isDark && styles.lightInput]}
            placeholder="What's on your mind?"
            placeholderTextColor={isDark ? '#666' : '#999'}
            multiline
            numberOfLines={4}
            value={newPost.content}
            onChangeText={text => setNewPost(prev => ({ ...prev, content: text }))}
          />
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreatePost}>
            <Text style={styles.createButtonText}>Create Post</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Chatbot Modal */}
      {showChatbot && (
        <Animated.View 
          entering={FadeInUp.springify()}
          style={[styles.chatbotModal, !isDark && styles.lightModal]}>
          <View style={styles.modalHeader}>
            <View style={styles.chatbotInfo}>
              <Bot size={24} color="#00e6b8" />
              <Text style={[styles.modalTitle, !isDark && styles.lightModalTitle]}>Investment Advisor</Text>
            </View>
            <TouchableOpacity onPress={() => setShowChatbot(false)}>
              <X size={24} color={isDark ? '#fff' : '#1a1a1a'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatMessages}>
            {chatMessages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={FadeInDown.delay(index * 100).springify()}
                style={[
                  styles.messageContainer,
                  message.isBot ? styles.botMessage : styles.userMessage,
                  !isDark && (message.isBot ? styles.lightBotMessage : styles.lightUserMessage)
                ]}>
                {message.isBot && (
                  <Bot size={20} color="#00e6b8" style={styles.messageIcon} />
                )}
                <Text style={[
                  styles.messageText,
                  message.isBot ? styles.botMessageText : styles.userMessageText,
                  !isDark && (message.isBot ? styles.lightBotMessageText : styles.lightUserMessageText)
                ]}>
                  {message.text}
                </Text>
              </Animated.View>
            ))}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={[styles.chatInput, !isDark && styles.lightInput]}
              placeholder="Ask about investments..."
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}>
              <Send size={20} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.chatbotButton, !isDark && styles.lightActionButton]}
          onPress={() => setShowChatbot(true)}>
          <Bot size={24} color={isDark ? '#fff' : '#1a1a1a'} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setShowNewPost(true)}>
          <Plus size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>
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
  header: {
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  lightTitle: {
    color: '#1a1a1a',
  },
  newsScroll: {
    paddingHorizontal: 20,
  },
  newsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    width: 300,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#00e6b8',
  },
  lightNewsCard: {
    backgroundColor: '#ffffff',
    borderColor: '#00e6b8',
  },
  newsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lightNewsTitle: {
    color: '#1a1a1a',
  },
  newsSource: {
    color: '#00e6b8',
    fontSize: 14,
  },
  discussionsSection: {
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lightSectionTitle: {
    color: '#1a1a1a',
  },
  discussionCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  lightDiscussionCard: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discussionIcon: {
    marginRight: 16,
  },
  discussionContent: {
    flex: 1,
  },
  discussionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lightDiscussionTitle: {
    color: '#1a1a1a',
  },
  discussionAuthor: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  lightDiscussionAuthor: {
    color: '#999',
  },
  discussionDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
  },
  lightDiscussionDescription: {
    color: '#666',
  },
  discussionStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    color: '#666',
    fontSize: 14,
  },
  lightStatText: {
    color: '#999',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    gap: 12,
    alignItems: 'flex-end',
  },
  chatbotButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
  lightActionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00e6b8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lightModal: {
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chatbotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  lightModalTitle: {
    color: '#1a1a1a',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  lightInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: '#1a1a1a',
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    height: 120,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#00e6b8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatbotModal: {
    position: 'absolute',
    top: 100,
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    padding: 20,
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
  chatMessages: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  lightBotMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  lightUserMessage: {
    backgroundColor: '#00e6b8',
  },
  messageIcon: {
    marginRight: 8,
    marginTop: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    borderRadius: 16,
  },
  botMessageText: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userMessageText: {
    color: '#1a1a1a',
    backgroundColor: '#00e6b8',
  },
  lightBotMessageText: {
    color: '#1a1a1a',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  lightUserMessageText: {
    color: '#1a1a1a',
    backgroundColor: '#00e6b8',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 12,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00e6b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});