import bcrypt from 'bcryptjs';

export async function hashedPassword(password) {
  try {
     const saltRounds =12;
    const hashPassword= await bcrypt.hash(password,saltRounds)
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
}

export async function comparePassword(password,hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
};