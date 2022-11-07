export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, ...action.payload };
    case "CLEAR_USER_INFO":
      return {
        name: "",
        bio: "",
        profilePic: "",
        postCount: "",
        friendsCount: "",
        requestCount: "",
      };
    case "SET_USER_PROFILE_PIC":
      return { ...state, profilePic: action.payload };
    case "UPDATE_USER_PROFILE_AFTER_POST_ADDED":
      return { ...state, postCount: state.postCount + 1 };
    case "UPDATE_USER_PROFILE_AFTER_REQUEST_ACCEPTED":
      return {
        ...state,
        friendsCount: state.friendsCount + 1,
        requestCount: state.requestCount - 1,
      };
    case "UPDATE_USER_PROFILE_AFTER_REQUEST_DECLINED":
      return {
        ...state,
        requestCount: state.requestCount - 1,
      };
    case "UPDATE_USER_PROFILE_AFTER_REQUEST_SENT":
      return {
        ...state,
        requestCount: state.requestCount + 1,
      };
    default:
      return state;
  }
};
