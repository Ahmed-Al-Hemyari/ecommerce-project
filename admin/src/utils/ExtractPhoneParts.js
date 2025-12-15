const extractPhoneParts = (phone, countries) => {
  // sort by longest dial code first (important!)
  const sorted = [...countries].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  for (const c of sorted) {
    if (phone.startsWith(c.dialCode)) {
      return {
        countryCode: c.dialCode,
        number: phone.slice(c.dialCode.length)
      };
    }
  }

  // fallback
  return {
    countryCode: "",
    number: phone
  };
};

export default extractPhoneParts