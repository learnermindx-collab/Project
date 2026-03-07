import { notification } from "antd";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  fallback ||
  "Something went wrong";

const notify = {
  success(message, description) {
    notification.success({ message, description, duration: 3 });
  },
  error(message, description) {
    notification.error({ message, description, duration: 4 });
  },
  apiError(error, fallbackMessage, description) {
    const message = getErrorMessage(error, fallbackMessage);
    notification.error({ message, description, duration: 4 });
  },
};

export default notify;
