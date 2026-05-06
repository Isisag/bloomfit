export {};

// Minimal interface to avoid requiring `webworker` lib in tsconfig
interface WorkerCtx {
  addEventListener(type: 'message', handler: (e: MessageEvent) => void): void;
  postMessage(data: { elapsed: number }): void;
}
const ctx = self as unknown as WorkerCtx;

type InMessage = { type: 'start' | 'pause' | 'resume' | 'stop' | 'reset' };

let intervalId: ReturnType<typeof setInterval> | null = null;
let startTime = 0;
let accumulated = 0;

function clearTick() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startTick() {
  clearTick();
  intervalId = setInterval(() => {
    ctx.postMessage({ elapsed: accumulated + (performance.now() - startTime) });
  }, 100);
}

ctx.addEventListener('message', (e: MessageEvent<InMessage>) => {
  switch (e.data.type) {
    case 'start':
      accumulated = 0;
      startTime = performance.now();
      startTick();
      break;
    case 'pause':
      accumulated += performance.now() - startTime;
      clearTick();
      break;
    case 'resume':
      startTime = performance.now();
      startTick();
      break;
    case 'stop':
      // Stop without sending 0 — React keeps the last elapsed value for the completed screen
      clearTick();
      accumulated = 0;
      break;
    case 'reset':
      clearTick();
      accumulated = 0;
      ctx.postMessage({ elapsed: 0 });
      break;
  }
});
