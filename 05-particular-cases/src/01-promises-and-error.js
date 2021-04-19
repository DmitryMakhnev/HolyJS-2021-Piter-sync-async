
try {
  await new Promise(resolve => {
    throw new Error(`I'm so sorry`);
    resolve();
  });
} catch (e) {
  console.log(e);
}
