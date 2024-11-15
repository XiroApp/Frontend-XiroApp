export function validateUsername(username) {
  const regex = /^[a-zA-ZáéíóúüñÑ_\s]{3,30}$/;
  return regex.test(username);
}

export function validateBio(bio) {
  const regex = /^[\w\s-]{0,200}$/;
  return regex.test(bio);
}
export function validatePhone(phone) {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
}
export function validateEmail(email) {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
}
export function validatePassword(password) {
  return password.length >= 6;
}
export function validatePasswords(password, verifyPassword) {
  return password === verifyPassword && verifyPassword.length;
}
export function validatePDFFile(fileName) {
  const regex = /[a-zA-Z0-9\-_\.]+\s*\.pdf/gi;

  const result = regex.test(fileName);
  const isPDF = fileName.split(".").reverse()[0] === "pdf";

  return isPDF;
}
export function validateBirthdate(birthdate) {
  // Convertir la fecha a un objeto Date
  const fechaNacimientoDate = birthdate
    ? new Date(birthdate?.split("T")[0])
    : new Date();

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la diferencia de años entre la fecha actual y la fecha de nacimiento
  const diferenciaAnios =
    fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();

  // Calcular la diferencia de meses entre la fecha actual y la fecha de nacimiento
  const diferenciaMeses =
    fechaActual.getMonth() - fechaNacimientoDate.getMonth();

  // Calcular la diferencia de días entre la fecha actual y la fecha de nacimiento
  const diferenciaDias = fechaActual.getDate() - fechaNacimientoDate.getDate();

  // Si la diferencia de años es menor a 18, la persona es menor de edad
  if (diferenciaAnios < 18) {
    return false;
  }

  // Si la diferencia de años es 18, verificar los meses y días
  if (diferenciaAnios === 18) {
    if (diferenciaMeses < 0) {
      return false;
    } else if (diferenciaMeses === 0 && diferenciaDias < 0) {
      return false;
    }
  }

  // Validar si la fecha de nacimiento es igual o posterior a la fecha actual
  if (fechaNacimientoDate <= fechaActual) {
    return true;
  } else if (fechaNacimientoDate >= fechaActual) {
    return false;
  }
  // La fecha es válida y la persona es mayor de 18 años
  return true;
}

/* COMPOSED VALIDATORS */
export function registerValidator(input) {
  let name = !validateUsername(input.name);
  let email = !validateEmail(input.email);
  let password = !validatePassword(input.password);
  let verifyPassword = !validatePasswords(input.password, input.verifyPassword);
  let conditionsChecked = !input.conditionsChecked;

  if (!name && !email && !password && !verifyPassword && !conditionsChecked)
    return { error: false, allowRegister: true };
  else
    return {
      error: { name, email, password, verifyPassword, conditionsChecked },
      allowRegister: false,
    };
}
export function updateUserValidator(
  userDisplayName,
  userPhone,
  userBio,
  userBirthdate
) {
  let displayName = !validateUsername(userDisplayName);
  let phone = !validatePhone(userPhone);
  let bio = !validateBio(userBio);
  let birthdate = !validateBirthdate(userBirthdate);

  if (!displayName && !phone && !bio && !birthdate)
    return { error: false, allowUpdate: true };
  else
    return {
      error: { displayName, phone, bio, birthdate },
      allowUpdate: false,
    };
}
export function createAddressValidator(
  username,
  usernumber,
  userzipCode,
  userfloorOrApartment,
  usercity,
  userlocality,
  usertag
) {
  let name = !(username && username.length < 30) ? true : false;
  let number = !(usernumber && usernumber < 99999 && usernumber > 0)
    ? true
    : false;
  let zipCode = !(userzipCode && userzipCode < 9999 && userzipCode > 999)
    ? true
    : false;
  let floorOrApartment = !(
    userfloorOrApartment &&
    userfloorOrApartment.length < 30 &&
    userfloorOrApartment.length < 30
  )
    ? true
    : false;
  let city = !(usercity && usercity.length > 0) ? true : false;
  let locality = !(userlocality && userlocality.length > 0) ? true : false;
  let tag = !(usertag && usertag.length > 0 && usertag.length < 20)
    ? true
    : false;

  if (
    !name &&
    !number &&
    !zipCode &&
    !floorOrApartment &&
    !city &&
    !locality &&
    !tag
  )
    return { error: false, allowCreate: true };
  else
    return {
      error: { name, number, zipCode, floorOrApartment, city, locality, tag },
      allowCreate: false,
    };
}

export function updatePasswordValidator(input) {
  let currentPassword = !validatePassword(input.currentPassword);
  let newPassword = !validatePassword(input.newPassword);
  let verifyNewPassword = !validatePasswords(
    input.newPassword,
    input.verifyNewPassword
  );

  if (!currentPassword && !newPassword && !verifyNewPassword)
    return { error: false, allowRegister: true };
  else
    return {
      error: { currentPassword, newPassword, verifyNewPassword },
      allowRegister: false,
    };
}

/* ADMIN VALIDATORS */
export function createCouponValidator(
  couponName,
  couponCode,
  couponType,
  couponStock,
  couponAmmount,
  couponStatus
) {
  let name = !(couponName && couponName.length < 30) ? true : false;
  let code = !(couponCode && couponCode.length < 30) ? true : false;
  let type = !(couponType && couponType.length) ? true : false;
  let stock = !(couponStock && couponStock < 99999) ? true : false;
  let ammount = true;

  if (couponType) {
    if (couponType[0] === "%") {
      ammount = !(couponAmmount && couponAmmount <= 100 && couponAmmount > 0)
        ? true
        : false;
    } else if (couponType[0] === "$") {
      ammount = !(couponAmmount && couponAmmount <= 9999 && couponAmmount > 0)
        ? true
        : false;
    }
  }
  let status = !(couponStatus && couponStatus.length) ? true : false;

  if (!name && !code && !type && !stock && !ammount && !status)
    return { error: false, allowCreate: true };
  else
    return {
      error: {
        name,
        code,
        type,
        stock,
        ammount,
        status,
      },
      allowCreate: false,
    };
}
