export const friendRequestReducer = (state, action) => {
  switch (action.type) {
    case "FRIEND_REQ_SENT":
      return { ...state, isReqSent: true };
    case "FRIEND_REQ_NOT_SENT":
      return { ...state, isReqSent: false };
    case "FRIENDS_OR_PENDING_MESSAGE":
      return { ...state, reqStatus: action.payload };
    case "ADD_FRIENDS_MESSAGE":
      return { ...state, reqStatus: action.payload };
    case "ADD_FRIEND_REQUESTS":
      return { ...state, requests: action.payload };
    default:
      throw Error("Friend Request Reducer Error");
  }
};
