// src/pdfWorker.ts

importScripts("https://unpkg.com/pdfjs-dist/build/pdf.js");

interface WorkerMessage {
  pdfUrl: string;
}

self.onmessage = async function (event: MessageEvent<WorkerMessage>) {
  const { pdfUrl } = event.data;

  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1); // Load the first page

    // Extract text content from the page
    const textContent = await page.getTextContent();

    self.postMessage({
      textContent: textContent.items.map((item) => item.str).join(" "),
    });
  } catch (error) {
    self.postMessage({ error: (error as Error).message });
  }
};
function importScripts(arg0: string) {
  throw new Error("Function not implemented.");
}
