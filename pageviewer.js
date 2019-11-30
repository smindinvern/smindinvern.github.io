'use strict';

// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = './cv.pdf';

pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '../build/pdf.worker.js';

// Asynchronous download of PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');
  
  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');
    
    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var annotationLayer = document.getElementById('annotation-layer');
      
    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(setupAnnotations(page, viewport, canvas, annotationLayer));
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });  
});

/* Based on https://stackoverflow.com/a/20141227 */
function setupAnnotations(page, viewport, canvas, annotationLayer) {
    var promise = page.getAnnotations().then(function (annotations) {
	var annotationLayerFactory = new pdfjsViewer.DefaultAnnotationLayerFactory();
	var annotationBuilder = annotationLayerFactory.createAnnotationLayerBuilder(annotationLayer, page);
	annotationBuilder.render(viewport);
  });
  return promise;
}
