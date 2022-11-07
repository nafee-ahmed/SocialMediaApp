export const postReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "ADD_FRIENDS_POSTS":
      return {
        ...state,
        friendPosts: [...state.friendPosts, ...action.payload],
      };
    case "SET_FRIENDS_POSTS":
      return {
        ...state,
        friendPosts: action.payload,
      };
    case "SET_STATES_AFTER_POST_ADDED":
      return {
        ...state,
        previewSource: "",
        postCaption: "",
        postFeed: "Post Shared",
      };
    case "SET_POST_FEED":
      return {
        ...state,
        postFeed: action.payload,
      };
    case "SET_PREVIEW_SOURCE":
      return {
        ...state,
        previewSource: action.payload,
      };
    case "SET_POST_CAPTION":
      return {
        ...state,
        postCaption: action.payload,
      };
    case "SET_FILE_INPUT":
      return {
        ...state,
        fileInputState: action.payload,
      };
    default:
      throw Error("Post Reducer Error");
  }
};
