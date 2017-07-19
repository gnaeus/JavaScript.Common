/**
 * Pretty print phone number.
 */
export function formatPhoneNumber(number) {
  if (number == null || number.length <= 3) {
    return number;
  }

  var numberParts = [number.substr(number.length - 2, 2), number.substr(number.length - 4, 2)];

  if (number.length > 4) {
    var i = number.length - 4;

    if (number.length > 7) {
      for (; i >= 3; i -= 3) {
        numberParts.push(number.substr(i - 3, 3));
      }
    }
    if (i > 0) {
      numberParts.push(number.substr(0, i));
    }
  }

  return numberParts.reverse().join("-");
}
