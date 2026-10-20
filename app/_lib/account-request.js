export async function accountRequest(operation, timeout = 10000) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new Error("Account connection timed out. Please try again.")), timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchAccount(url, options = {}) {
  const controller = new AbortController();
  try {
    return await accountRequest(() => fetch(url, { ...options, signal: controller.signal }));
  } catch (error) {
    controller.abort();
    throw error;
  }
}
