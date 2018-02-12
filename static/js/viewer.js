// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
var url = 'static/pdf/turnjs4-api-docs.pdf';

// The workerSrc property shall be specified.
PDFJS.workerSrc = 'bower_components/pdfjs-dist/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5,
    canvaslst = [];
    context = [];

    for (var i=0; i < 2; i++) {
      canvaslst.push(document.getElementById('c' + i));
      context.push(canvaslst[i].getContext('2d'));
    }

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  var index = (num - 1) % 2;
  var canvas = canvaslst[index];
  var ctx = context[index];
  if (num <= pdfDoc.numPages) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function() {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Update page counters
  document.getElementById('page_num').textContent = pageNum;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    for (var i = 0; i < 2; i++)
      renderPage(num + i);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum -= 2;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum + 2 >= pdfDoc.numPages) {
    return;
  }
  pageNum += 2;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
PDFJS.getDocument(url).then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;

  // Initial/first page rendering
  for (var i = 0; i < 2; i++) {
    renderPage(1 + i);
  }
});