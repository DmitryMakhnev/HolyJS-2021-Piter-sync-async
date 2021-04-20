
try {
  await new Promise((resolve, reject)  => {
    new Promise(r2 => {
      reject(new Error(`I'm so sorry`));
      // resolve();
    })
  });
} catch (e) {
  console.log(e);
}
