<template>
  <div class="comments-section">
    <h3>评论区</h3>
    
    <!-- 评论输入框 -->
    <div v-if="isAuthenticated" class="comment-input">
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        rows="3"
      ></textarea>
      <button @click="submitComment" :disabled="!newComment.trim()">
        发表评论
      </button>
    </div>
    <div v-else class="login-prompt">
      <router-link to="/login">登录</router-link> 后发表评论
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
          <span class="username">{{ comment.user?.username }}</span>
          <span class="time">{{ formatDate(comment.created_at) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        
        <!-- 点赞点踩按钮 -->
        <div class="comment-reactions">
          <button 
            class="reaction-btn"
            @click="handleReaction(comment.id, 'like')"
          >
            <i class="fas fa-thumbs-up"></i>
            <span>{{ comment.likes }}</span>
          </button>
          <button 
            class="reaction-btn"
            @click="handleReaction(comment.id, 'dislike')"
          >
            <i class="fas fa-thumbs-down"></i>
            <span>{{ comment.dislikes }}</span>
          </button>
        </div>
        
        <!-- 回复按钮和删除按钮 -->
        <div class="comment-actions">
          <button v-if="isAuthenticated" @click="showReplyInput(comment.id)">
            回复
          </button>
          <button 
            v-if="canDelete(comment)" 
            @click="deleteComment(comment.id)"
            class="delete-btn"
          >
            删除
          </button>
        </div>

        <!-- 回复输入框 -->
        <div v-if="replyToId === comment.id" class="reply-input">
          <textarea
            v-model="replyContent"
            placeholder="写下你的回复..."
            rows="2"
          ></textarea>
          <div class="reply-actions">
            <button @click="submitReply(comment.id)" :disabled="!replyContent.trim()">
              提交回复
            </button>
            <button @click="cancelReply" class="cancel-btn">取消</button>
          </div>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies">
          <div v-for="reply in comment.replies" :key="reply.id" class="reply">
            <div class="comment-header">
              <span class="username">{{ reply.user?.username }}</span>
              <span class="time">{{ formatDate(reply.created_at) }}</span>
            </div>
            <div class="comment-content">{{ reply.content }}</div>
            <div class="comment-actions">
              <button 
                v-if="canDelete(reply)" 
                @click="deleteComment(reply.id)"
                class="delete-btn"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { commentApi } from '@/services/api/commentApi'
import type { Comment } from '@/services/types/comment'

const props = defineProps<{
  postId: number
}>()

const userStore = useUserStore()
const comments = ref<Comment[]>([])
const newComment = ref('')
const replyContent = ref('')
const replyToId = ref<number | null>(null)

const isAuthenticated = computed(() => userStore.isAuthenticated)
const currentUser = computed(() => userStore.user)

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

// 判断是否可以删除评论
const canDelete = (comment: Comment) => {
  return isAuthenticated.value && 
    (userStore.isAdmin || currentUser.value?.id === comment.user_id)
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const { data } = await commentApi.getComments(props.postId)
    console.log('获取到的原始评论数据:', data)
    
    if (data.data) {
      comments.value = data.data
      console.log('处理后的评论数据:', comments.value)
    }
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    const response = await commentApi.createComment(props.postId, {
      content: newComment.value
    })
    console.log('创建评论响应:', response)
    newComment.value = ''
    await fetchComments()
  } catch (error) {
    console.error('发表评论失败:', error)
  }
}

// 显示回复输入框
const showReplyInput = (commentId: number) => {
  replyToId.value = commentId
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyToId.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = async (parentId: number) => {
  if (!replyContent.value.trim()) return
  
  try {
    await commentApi.createComment(props.postId, {
      content: replyContent.value,
      parent_id: parentId
    })
    cancelReply()
    await fetchComments()
  } catch (error) {
    console.error('发表回复失败:', error)
  }
}

// 删除评论
const deleteComment = async (commentId: number) => {
  if (!isAuthenticated.value) {
    alert('请先登录后再进行操作');
    return;
  }

  if (!confirm('确定要删除这条评论吗？')) {
    return;
  }

  try {
    await commentApi.deleteComment(commentId);
    comments.value = comments.value.filter(c => c.id !== commentId);
  } catch (error: any) {
    console.error('删除评论失败:', error);
    alert(error.response?.data?.message || '删除评论失败');
  }
}

// 处理点赞/点踩
const handleReaction = async (commentId: number, type: 'like' | 'dislike') => {
  if (!isAuthenticated.value) {
    alert('请先登录后再操作');
    return;
  }

  try {
    const response = await commentApi.reactToComment(commentId, type)
    console.log('点赞/点踩响应:', response.data)
    
    // 如果后端返回成功，重新获取评论列表
    if (response.data.code === 200) {
      await fetchComments()
    }
  } catch (error) {
    console.error('点赞/点踩失败:', error)
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comments-section {
  margin-top: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.comment-input {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #8dc9e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #47abef;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.comment {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.comment-header {
  margin-bottom: 8px;
}

.username {
  font-weight: bold;
  margin-right: 10px;
}

.time {
  color: #666;
  font-size: 0.9em;
}

.comment-actions {
  margin-top: 8px;
}

.delete-btn {
  background-color: #ff4444;
  margin-left: 10px;
}

.delete-btn:hover {
  background-color: #cc0000;
}

.replies {
  margin-left: 20px;
  margin-top: 10px;
  padding-left: 15px;
  border-left: 2px solid #eee;
}

.reply {
  margin-top: 10px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.login-prompt a {
  color: #8dc9e8;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}

.comment-reactions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.reaction-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reaction-btn:hover {
  background-color: #f0f0f0;
}

.reaction-btn.active {
  color: #8dc9e8;
  border-color: #8dc9e8;
}

.reaction-btn i {
  font-size: 14px;
}

.reaction-btn span {
  font-size: 12px;
}
</style> 