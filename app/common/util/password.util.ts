export function hasSimpleSequence(s: string) {
  // detecta "123", "abc" e variantes consecutivas
  const seqs = ["0123456789", "abcdefghijklmnopqrstuvwxyz"];
  const lower = s.toLowerCase();
  return seqs.some((base) => {
    for (let i = 0; i < base.length - 2; i++) {
      const sub = base.slice(i, i + 3);
      if (lower.includes(sub)) return true;
    }
    return false;
  });
}

export function hasRepeatedRun(s: string) {
  // 3 caracteres iguais seguidos, ex: "aaa"
  return /(.)\1\1/.test(s);
}

export const ruleLenOk = (password: string) => password.length >= 8;
export const ruleNoSeqOk = (password: string) =>
  password.length === 0
    ? false
    : !hasSimpleSequence(password) && !hasRepeatedRun(password);
