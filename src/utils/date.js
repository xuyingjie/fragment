export function formatTime(timestamp = 0) {
  return new Date(timestamp).toDateString().replace(/(.{4})(.{6})(.{5})/, '$2,$3 ')
}
