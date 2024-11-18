import axios from 'axios';
import {AI_BASE_URL, axiosInstance, BASE_URL} from '../AxiosInstance';

export const signup = async (username, email, password) => {
  try {
    const response = await axiosInstance.post('auth/signup', {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const signin = async (email, password) => {
  try {
    const response = await axiosInstance.post('auth/signin', {
      email,
      password,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updatePreferences = async (
  token,
  personality,
  facialFeatures,
  bodyDescription,
  gender,
  profile,
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/updatePreferences',
      {
        personality,
        facialFeatures,
        bodyDescription,
        gender,
        profile,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getUserDetails = async token => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.get(
      'user/getDetails',

      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getPersonality = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}f/personalitydescription`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getPersonalityMale = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}m/personalitydescription`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getFacialFeatures = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}f/facialdescription`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const getFacialFeaturesMale = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}m/facialdescription`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getBodyDescription = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}f/bodydescription`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getBodyDescriptionMale = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}m/bodydescription`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getConversation = async (token, chatId) => {
  // console.log(chatId, '======>>>');
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.get(`user/getChat/${chatId}`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const sendStandardChat = async (token, userInput, chatId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/f-standardchat',
      {
        userInput,
        chatId,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendStandardChatMale = async (token, userInput, chatId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/m-standardchat',
      {
        userInput,
        chatId,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendPremiumChat = async (token, userInput, chatId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/f-premiumchat',

      {
        userInput,
        chatId,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendPremiumChatMale = async (token, userInput, chatId) => {
  console.log('works premium------->>>>');
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/m-premiumchat',

      {
        userInput,
        chatId,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendFreeChat = async (token, userInput, chatId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/f-freechat',

      {
        userInput,
        chatId,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendFreeChatMale = async (token, userInput, chatId) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      'user/m-freechat',

      {
        userInput,
        chatId,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const updateSubscriptionPlan = async (token, rank) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.put(
      'user/updateRank',
      {
        rank,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const uploadAudio = async (
  token,
  chatId,
  audioFilePath,
  shortMemory,
  longMemory,
) => {
  const formData = new FormData();

  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };
  formData.append('mp4File', {
    uri: audioFilePath,
    type: 'audio/mp4',
    name: 'sound',
  });
  formData.append('shortMemory', shortMemory);
  formData.append('longMemory', longMemory);
  formData.append('chatId', chatId);
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}user/uploadAudio`,
      formData,
      {headers},
    );
    return response.data;
  } catch (error) {
    console.log('Error uploading audio file:', error.message);
  }
};

export const getGreetings = async token => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.get('user/greet', {headers});
    return response;
  } catch (error) {
    return error;
  }
};
export const getGreetingsMale = async token => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.get('user/m-greet', {headers});
    return response;
  } catch (error) {
    return error;
  }
};

export const getChatList = async token => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.get(
      'user/getAllChats',

      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const adjustPreferences = async (
  token,
  chatId,
  personality,
  facialFeatures,
  bodyDescription,
  gender,
  profile,
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.post(
      `user/adjustPreference/${chatId}`,
      {
        personality,
        facialFeatures,
        bodyDescription,
        gender,
        profile,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const searchChat = async (token, name) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.get(
      `user/searchChat?name=${name}`,

      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getFemalePicture = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}f/generatepreview`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const getMalePicture = async user_input => {
  try {
    const response = await axios.get(`${AI_BASE_URL}m/generatepreview`, {
      user_input,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateCallDuration = async (token, duration) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.put(
      'user/update-call-duration',
      {
        duration,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const updateViewPictureStatus = async (token, chatId, imageUrl) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const response = await axiosInstance.put(
      'user/view-picture',
      {
        chatId,
        imageUrl,
      },
      {headers},
    );
    return response;
  } catch (error) {
    return error;
  }
};
