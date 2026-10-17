import { api, getErrorMessage } from "@/services/api";
import { getStoredUserToken } from "@/services/userAuth.service";

const getAuthHeaders = () => {
  const token = getStoredUserToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getArticleInteractionsService = async (articleId) => {
  try {
    const response = await api.get(`/articles/${articleId}/interactions`, {
      headers: getAuthHeaders(),
    });
    return response.data?.data || { likesCount: 0, hasLiked: false, comments: [] };
  } catch (error) {
    // If backend is unreachable or offline, gracefully return empty interaction data
    return { likesCount: 0, hasLiked: false, comments: [] };
  }
};

export const toggleArticleLikeService = async (articleId) => {
  try {
    const response = await api.post(
      `/articles/${articleId}/like`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data?.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update like"));
  }
};

export const addArticleCommentService = async (articleId, content) => {
  try {
    const response = await api.post(
      `/articles/${articleId}/comments`,
      { content },
      { headers: getAuthHeaders() }
    );
    return response.data?.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to post comment"));
  }
};

export const deleteArticleCommentService = async (articleId, commentId) => {
  try {
    const response = await api.delete(
      `/articles/${articleId}/comments/${commentId}`,
      { headers: getAuthHeaders() }
    );
    return response.data?.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete comment"));
  }
};
