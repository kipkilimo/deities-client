declare module "pdfjs-dist/build/pdf" {
  const pdfjsLib: {
    renderTextLayer(arg0: {
      textContentStream: any;
      container: HTMLDivElement;
      viewport: any;
      textDivs: never[];
    }): unknown;
    getDocument: (url: string) => any;
  };
  export = pdfjsLib;
}
