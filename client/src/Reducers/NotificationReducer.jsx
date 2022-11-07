export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_NOTIFICATIONS":
      return { ...state, notificationRefresh: !state.notificationRefresh };
    case "UPDATE_UNSEEN_MESSAGES":
      return { ...state, unseenCount: action.payload };
    default:
      throw Error("Notification Reducer Error");
  }
};
