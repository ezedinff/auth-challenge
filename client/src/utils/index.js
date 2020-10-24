export const phoneFormater = (phoneNumber) => {
    return `+251${phoneNumber.slice(1)}`;
}

export const validatePhone = (phone) => phone.startsWith('09') && phone.length === 10 && Number(phone.slice(1));