const { get, put } = require("@vercel/blob");

const BASE_CATEGORIES = ["Todas", "Trabajo", "Estudios", "Personal"];
const STATE_PATHNAME = "data/state.json";

let memoryState = {
  tasks: [],
  categories: [...BASE_CATEGORIES]
};

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function normalizeState(rawState) {
  const tasks = Array.isArray(rawState?.tasks) ? rawState.tasks : [];
  const categories = Array.isArray(rawState?.categories) ? rawState.categories : [];

  const mergedCategories = [...BASE_CATEGORIES];
  categories.forEach((category) => {
    if (!mergedCategories.some((base) => base.toLowerCase() === String(category).toLowerCase())) {
      mergedCategories.push(category);
    }
  });

  return {
    tasks,
    categories: mergedCategories
  };
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readState() {
  if (!hasBlobToken()) {
    return memoryState;
  }

  const result = await get(STATE_PATHNAME, { access: "private" });
  if (!result || result.statusCode !== 200) {
    const initialState = normalizeState(memoryState);
    await writeState(initialState);
    return initialState;
  }

  const rawJson = await streamToString(result.stream);
  const parsedState = JSON.parse(rawJson);
  return normalizeState(parsedState);
}

async function writeState(nextState) {
  const normalizedState = normalizeState(nextState);

  if (!hasBlobToken()) {
    memoryState = normalizedState;
    return normalizedState;
  }

  await put(STATE_PATHNAME, JSON.stringify(normalizedState), {
    access: "private",
    addRandomSuffix: false,
    overwrite: true,
    contentType: "application/json"
  });

  return normalizedState;
}

module.exports = {
  BASE_CATEGORIES,
  readState,
  writeState
};
