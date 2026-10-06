export function blankIfUnset<T>(value: T | undefined): T | '' {
  if (value === null) {
    return value;
  }

  return value ?? '';
}
