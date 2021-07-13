import { App } from './App';

const app = new App();
const PORT = 4000;
(async () => {
  await app.start(PORT);
})()
  .then(() => {
    console.log(`Server is running on ${PORT} port!!`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(9);
  });
