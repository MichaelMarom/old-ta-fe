import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl }) => {

  return (
    <div style={{ width: "80px", height: "80px" }}>
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;
