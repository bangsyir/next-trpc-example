import { faker } from "@faker-js/faker";
import { db } from "../src/server/db";
import bcrypt from "bcrypt";

const createRandomUser = async () => {
  return await db.user.create({
    data: {
      name: faker.internet.displayName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("12345", 10),
    },
  });
};

async function main() {
  faker.helpers.multiple(createRandomUser, {
    count: 100,
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async () => {
    await db.$disconnect();
    process.exit();
  });
