export function passwordValidator(password, ConfirmPassword) {
  if (!password) return "Password can't be empty.";
  if (password.length < 5)
    return "Password must be at least 5 characters long.";
  if (password !== ConfirmPassword) return `Password doesn't match.`;
  return "";
}
