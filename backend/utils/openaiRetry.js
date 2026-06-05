const MAX_RETRIES   = 4;
const BASE_DELAY_MS = 2000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const withBackoff = async (fn, label = 'OpenAI') => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const is429   = err?.status === 429 || err?.response?.status === 429;
      const isLast  = attempt === MAX_RETRIES;
      if (!is429 || isLast) throw err;

      const retryAfter = Number(err?.headers?.['retry-after'] || 0);
      const delay = retryAfter > 0
        ? retryAfter * 1000
        : BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500;

      console.warn(`[${label}] 429 – retry ${attempt + 1}/${MAX_RETRIES} in ${(delay / 1000).toFixed(1)}s`);
      await sleep(delay);
    }
  }
};


const patchOpenAI = (client) => {
  // Patch chat completions
  const origChat = client.chat.completions.create.bind(client.chat.completions);
  client.chat.completions.create = (...args) =>
    withBackoff(() => origChat(...args), 'chat.completions');

  // Patch embeddings
  const origEmbed = client.embeddings.create.bind(client.embeddings);
  client.embeddings.create = (...args) =>
    withBackoff(() => origEmbed(...args), 'embeddings');

  return client;
};

module.exports = { patchOpenAI, withBackoff };
