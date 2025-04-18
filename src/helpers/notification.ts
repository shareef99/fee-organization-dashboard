import { notifications, NotificationData } from "@mantine/notifications";

export function showNotification(args: NotificationData) {
  return notifications.show(args);
}

export function updateNotification(args: NotificationData & { id: string }) {
  return notifications.update(args);
}

export function loadingNotification(args: NotificationData) {
  return notifications.show({
    loading: true,
    autoClose: false,
    withCloseButton: false,
    // color: "var(--primary)",
    ...args,
  });
}

export function successNotification(args: NotificationData & { id: string }) {
  return notifications.update({
    color: "teal",
    loading: false,
    autoClose: 3000,
    withCloseButton: true,
    ...args,
  });
}

export function errorNotification({
  update = true,
  ...args
}: NotificationData & { id: string; update?: boolean }) {
  if (update) {
    return notifications.update({
      color: "red",
      loading: false,
      autoClose: 3000,
      withCloseButton: true,
      ...args,
    });
  } else {
    return notifications.show({
      color: "red",
      autoClose: 3000,
      withCloseButton: true,
      ...args,
    });
  }
}

export const notificationMessages = {
  loading: "Please Wait",
  success: "Success",
  added: "Successfully Added",
  edited: "Successfully Edited",
  deleted: "Successfully Deleted",
  error: "Unknown Error",
} as const;
