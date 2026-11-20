import type { SampleTest, TestOutput } from "./challenge-tests";
export type RunResult = { tests: TestOutput[]; error: string | null };
// A disposable opaque-origin frame runs a worker. No parent DOM, storage or network access.
// Keep this interface when replacing sample execution with an external grading service.
export function runSamples(code: string, tests: SampleTest[]): Promise<RunResult> {
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    const token = crypto.randomUUID();
    frame.sandbox.add("allow-scripts");
    frame.hidden = true;
    let done = false;
    const finish = (result: RunResult) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      window.removeEventListener("message", listener);
      frame.remove();
      resolve(result);
    };
    const listener = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.token !== token) return;
      if (event.data.ready) {
        frame.contentWindow?.postMessage({ token, code, tests }, "*");
        return;
      }
      if (Array.isArray(event.data.tests) || typeof event.data.error === "string")
        finish({ tests: event.data.tests ?? [], error: event.data.error ?? null });
    };
    const timer = setTimeout(
      () =>
        finish({
          tests: [],
          error: "Execution stopped after 3 seconds. Check for an infinite loop or a slow test.",
        }),
      3000,
    );
    window.addEventListener("message", listener);
    const workerSource = `self.onmessage = async event => { const { code, tests } = event.data; try { const output = []; for (const test of tests) { const actual = await new Function(code + '\\nreturn (' + test.expression + ');')(); output.push({ name: test.name, passed: JSON.stringify(actual) === JSON.stringify(test.expected), actual: JSON.stringify(actual) ?? 'undefined', expected: JSON.stringify(test.expected) }); } self.postMessage({ tests: output }); } catch (error) { self.postMessage({ error: String(error) }); } };`;
    frame.srcdoc = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; img-src 'none';"><script>const token=${JSON.stringify(token)}; const worker = new Worker(URL.createObjectURL(new Blob([${JSON.stringify(workerSource)}], {type:'application/javascript'})));worker.onmessage=e=>{parent.postMessage({...e.data,token},'*');worker.terminate();};worker.onerror=e=>{parent.postMessage({error:e.message,token},'*');worker.terminate();};window.onmessage=e=>{if(e.source!==parent||e.data.token!==token)return;worker.postMessage(e.data);};parent.postMessage({token,ready:true},'*');<\/script>`;
    document.body.append(frame);
  });
}
