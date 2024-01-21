import bcrypt from "bcrypt";

const saltRounds = 10;

export default async (str: string) => await bcrypt.hash(str, saltRounds);
