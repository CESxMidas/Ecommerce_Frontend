/** Hiển thị thông báo tiếng Việt — map bản ghi cũ tiếng Anh từ backend */
const TITLE_MAP: Record<string, string> = {
  "Support ticket created": "Đã tạo yêu cầu hỗ trợ",
  "Phản hồi hỗ trợ mới": "Phản hồi hỗ trợ mới",
  "Email updated": "Email đã được cập nhật",
  "Password changed": "Mật khẩu đã được đổi",
};

export function localizeNotificationTitle(title: string): string {
  return TITLE_MAP[title] ?? title;
}

export function localizeNotificationMessage(message: string): string {
  return message
    .replace(
      /^Ticket "(.+)" was created\.$/,
      'Yêu cầu hỗ trợ "$1" đã được gửi thành công.',
    )
    .replace(
      /^Shop đã trả lời ticket "(.+)"\.$/,
      'Shop đã phản hồi yêu cầu "$1". Xem chi tiết tại mục Hỗ trợ.',
    )
    .replace(
      "Your account email was changed successfully.",
      "Email tài khoản của bạn đã được đổi thành công.",
    )
    .replace(
      "Your account password was changed.",
      "Mật khẩu tài khoản của bạn vừa được thay đổi.",
    );
}

export function formatNotificationDate(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
