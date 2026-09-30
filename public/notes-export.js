/* WMSI shared notes-and-export module.
   Requires window.docx (docx UMD), window.jspdf, window.saveAs (FileSaver).
   Public API on window.WMSI_Notes.

   USAGE (per page):
     WMSI_Notes.init({
       toolId: 'identifying-perspectives',
       pageTitleEn: 'Identifying & Explaining Perspectives',
       pageTitleZh: '识别与解释观点',
       subtitleEn: 'IGCSE Global Perspectives 0457 · Student worksheet',
       studentNameSelector: '#studentName',
       exportDocxSelector: '#exportDocxBtn',
       exportPdfSelector:  '#exportPdfBtn',
       fabLabelEn: 'My notes', fabLabelZh: '我的笔记',
       persist: [                        // fields to auto-persist to localStorage
         { selector: '#yourTurnText', kind: 'textarea', key: 'yourTurn' },
         { selector: '#studentName',  kind: 'input',    key: 'studentName' },
         { selector: '#chk0',         kind: 'checkbox', key: 'chk_0' },
         ...
       ],
       collect: function(){              // returns the worksheet content
         return {
           sections: [
             { heading: 'Your turn', blocks: [
               { type: 'p', runs: [{ text: 'answer text' }] }
             ]}
           ]
         };
       }
     });

   Block model:
     { type: 'p'|'h2'|'h3'|'ul'|'ol',
       runs?: [{text, bold?, italic?, underline?, highlight?}],
       items?: [ [runs...], [runs...] ]  // for ul/ol
     }

   Helpers exposed for building blocks in collect():
     WMSI_Notes.text(str, {bold, italic, underline, highlight})
     WMSI_Notes.p(runsOrString)         // paragraph
     WMSI_Notes.h(level, runsOrString)  // heading (2 or 3)
     WMSI_Notes.ul(items) / WMSI_Notes.ol(items) — items are strings or run-arrays
     WMSI_Notes.notesBlocks()           // returns the current notes editor as blocks
     WMSI_Notes.loadField(key), .saveField(key, value)
*/
(function(){
  "use strict";

  var CFG = null;
  var STORAGE_PREFIX = 'wne_';
  var NOTES_KEY = null;

  /* ---------- localStorage helpers (safe against disabled storage) ---------- */
  function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function lsSet(k, v){ try { localStorage.setItem(k, v); return true; } catch(e){ return false; } }

  function saveField(key, value){ lsSet(STORAGE_PREFIX + CFG.toolId + '_' + key, value); }
  function loadField(key){ return lsGet(STORAGE_PREFIX + CFG.toolId + '_' + key); }

  /* ---------- Rich-text run helpers (for pages to build blocks) ---------- */
  function text(str, opts){
    opts = opts || {};
    return { text: (str == null ? '' : String(str)),
             bold: !!opts.bold, italic: !!opts.italic,
             underline: !!opts.underline, highlight: !!opts.highlight };
  }
  function toRuns(x){
    if(x == null) return [text('')];
    if(typeof x === 'string') return [text(x)];
    if(Array.isArray(x)){
      return x.map(function(r){
        if(typeof r === 'string') return text(r);
        return r;
      });
    }
    return [text(String(x))];
  }
  function p(x){ return { type:'p', runs: toRuns(x) }; }
  function h(level, x){ return { type: level === 3 ? 'h3' : 'h2', runs: toRuns(x) }; }
  function ul(items){ return { type:'ul', items: (items || []).map(toRuns) }; }
  function ol(items){ return { type:'ol', items: (items || []).map(toRuns) }; }

  /* ---------- Panel: build DOM and wire ---------- */
  function buildPanel(){
    var fab = document.createElement('button');
    fab.id = 'wne-fab'; fab.type = 'button';
    // "Page notes": free writing for this page. Highlights and notes pinned to
    // the page text are a separate feature ("My notes" in the React app).
    fab.setAttribute('aria-label', 'Open page notes');
    fab.innerHTML =
      '<span class="wne-dot" aria-hidden="true"></span>' +
      '<span class="en">' + ((CFG && CFG.fabLabelEn) || 'Page notes') + '</span>' +
      '<span class="zh">' + ((CFG && CFG.fabLabelZh) || '页面笔记') + '</span>';

    var backdrop = document.createElement('div');
    backdrop.className = 'wne-backdrop';

    var panel = document.createElement('aside');
    panel.id = 'wne-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Page notes');
    panel.innerHTML =
      '<div class="wne-header">' +
        '<h3><span class="en">Page notes</span><span class="zh">页面笔记</span></h3>' +
        '<button class="wne-close" type="button" aria-label="Close">✕</button>' +
      '</div>' +
      '<div class="wne-toolbar">' +
        '<button type="button" data-cmd="bold" title="Bold"><strong>B</strong></button>' +
        '<button type="button" data-cmd="italic" title="Italic"><em>I</em></button>' +
        '<button type="button" data-cmd="underline" title="Underline"><span style="text-decoration:underline;">U</span></button>' +
        '<span class="wne-divider"></span>' +
        '<button type="button" data-cmd="formatBlock" data-arg="h2" title="Heading">H</button>' +
        '<button type="button" data-cmd="insertUnorderedList" title="Bulleted list">• List</button>' +
        '<button type="button" data-cmd="insertOrderedList" title="Numbered list">1. List</button>' +
        '<button type="button" data-cmd="highlight" title="Highlight">🖍</button>' +
        '<span class="wne-divider"></span>' +
        '<button type="button" data-cmd="removeFormat" title="Clear formatting">Clear</button>' +
      '</div>' +
      '<div class="wne-editor" id="wne-editor" contenteditable="true" ' +
           'data-placeholder="Start taking notes here — they save automatically and are included when you export your worksheet."></div>' +
      '<div class="wne-panel-footer">' +
        '<div class="wne-status" id="wne-status"><span class="en">Not saved yet</span><span class="zh">尚未保存</span></div>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    return { fab: fab, backdrop: backdrop, panel: panel };
  }

  var editorEl = null, statusEl = null;

  function openPanel(){
    document.getElementById('wne-panel').classList.add('open');
    document.querySelector('.wne-backdrop').classList.add('open');
    setTimeout(function(){ editorEl && editorEl.focus(); }, 250);
  }
  function closePanel(){
    document.getElementById('wne-panel').classList.remove('open');
    document.querySelector('.wne-backdrop').classList.remove('open');
  }

  var saveTimer = null;
  function saveNotes(){
    if(saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function(){
      var ok = lsSet(NOTES_KEY, editorEl.innerHTML);
      if(!statusEl) return;
      var isZh = document.body.classList.contains('lang-zh');
      if(ok){
        var t = new Date();
        var stamp = String(t.getHours()).padStart(2,'0') + ':' + String(t.getMinutes()).padStart(2,'0');
        statusEl.innerHTML = (isZh ? '已自动保存于 ' : 'Autosaved at ') + stamp;
      } else {
        statusEl.textContent = isZh ? '无法保存（存储不可用）' : 'Cannot save (storage unavailable)';
      }
    }, 400);
  }

  /* ---------- Notes DOM → block model (contenteditable → blocks) ---------- */
  function extractRuns(node, styleStack){
    var runs = [];
    if(!styleStack) styleStack = {bold:false, italic:false, underline:false, highlight:false};
    node.childNodes.forEach(function(child){
      if(child.nodeType === 3){
        var t = child.nodeValue;
        if(t){ runs.push(Object.assign({text:t}, styleStack)); }
      } else if(child.nodeType === 1){
        var tag = child.tagName.toLowerCase();
        var nested = Object.assign({}, styleStack);
        if(tag === 'b' || tag === 'strong') nested.bold = true;
        if(tag === 'i' || tag === 'em') nested.italic = true;
        if(tag === 'u') nested.underline = true;
        if(tag === 'mark') nested.highlight = true;
        if(child.style && child.style.backgroundColor &&
           child.style.backgroundColor !== 'transparent' &&
           child.style.backgroundColor !== 'inherit'){
          nested.highlight = true;
        }
        if(tag === 'br'){
          runs.push({text:'\n', bold:false, italic:false, underline:false, highlight:false});
          return;
        }
        runs = runs.concat(extractRuns(child, nested));
      }
    });
    return runs;
  }
  function notesBlocks(){
    if(!editorEl) return [];
    var blocks = [];
    var hasBlocks = Array.prototype.some.call(editorEl.childNodes, function(n){
      return n.nodeType === 1 &&
        ['p','div','h1','h2','h3','ul','ol','blockquote'].indexOf(n.tagName.toLowerCase()) !== -1;
    });
    if(!hasBlocks && editorEl.childNodes.length > 0){
      blocks.push({type:'p', runs: extractRuns(editorEl)});
      return blocks;
    }
    editorEl.childNodes.forEach(function(node){
      if(node.nodeType === 3){
        if(node.nodeValue.trim()){
          blocks.push({type:'p', runs:[{text:node.nodeValue, bold:false, italic:false, underline:false, highlight:false}]});
        }
        return;
      }
      if(node.nodeType !== 1) return;
      var tag = node.tagName.toLowerCase();
      if(tag === 'h1' || tag === 'h2' || tag === 'h3'){
        blocks.push({type:'h2', runs: extractRuns(node)});
      } else if(tag === 'ul' || tag === 'ol'){
        var items = [];
        node.querySelectorAll(':scope > li').forEach(function(li){ items.push(extractRuns(li)); });
        blocks.push({type: tag, items: items});
      } else {
        var runs = extractRuns(node);
        if(runs.length) blocks.push({type:'p', runs: runs});
        else blocks.push({type:'p', runs:[{text:'', bold:false, italic:false, underline:false, highlight:false}]});
      }
    });
    return blocks;
  }

  /* ---------- Persistence: hook up form fields declaratively ---------- */
  function persistFieldConfig(cfg){
    if(!cfg || !cfg.selector) return;
    var el = document.querySelector(cfg.selector);
    if(!el) return;
    var kind = cfg.kind || (el.tagName === 'INPUT' && el.type === 'checkbox' ? 'checkbox'
                          : el.tagName === 'TEXTAREA' ? 'textarea' : 'input');
    var key = cfg.key || cfg.selector.replace(/[^a-zA-Z0-9_]/g,'_');
    if(kind === 'checkbox'){
      if(loadField(key) === '1'){ el.checked = true; el.dispatchEvent(new Event('change', {bubbles:true})); }
      el.addEventListener('change', function(){ saveField(key, el.checked ? '1' : '0'); });
    } else {
      var saved = loadField(key);
      if(saved !== null){
        el.value = saved;
        el.dispatchEvent(new Event('input', {bubbles:true}));
      }
      el.addEventListener('input', function(){ saveField(key, el.value); });
    }
  }

  /* ---------- Utility ---------- */
  function formatDate(d){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() +
      ', ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  function safeFilename(name){
    return String(name || 'unnamed').replace(/[^a-zA-Z0-9_\-]/g,'_').slice(0, 60);
  }
  function getStudentName(){
    if(!CFG.studentNameSelector) return 'Unnamed';
    var el = document.querySelector(CFG.studentNameSelector);
    return (el && el.value || '').trim() || 'Unnamed student';
  }

  /* ---------- Assemble the workbook (notes + collect()) ---------- */
  function buildWorkbook(){
    var sections = [];

    var noteBlocks = notesBlocks();
    var hasNotes = noteBlocks.some(function(b){
      if(b.type === 'ul' || b.type === 'ol'){
        return b.items.some(function(it){ return it.some(function(r){ return r.text.trim(); }); });
      }
      return b.runs.some(function(r){ return r.text.trim(); });
    });
    if(hasNotes) sections.push({ heading: 'My notes', blocks: noteBlocks });

    var extra = null;
    try { extra = CFG.collect && CFG.collect(); } catch(e){ console.error('collect() threw:', e); }
    if(extra && extra.sections){
      extra.sections.forEach(function(s){ if(s && s.blocks && s.blocks.length) sections.push(s); });
    }

    return {
      studentName: getStudentName(),
      timestamp: new Date(),
      pageTitleEn: CFG.pageTitleEn || document.title,
      subtitleEn: CFG.subtitleEn || '',
      filenameStem: CFG.filenameStem || CFG.toolId || 'worksheet',
      sections: sections
    };
  }

  /* ---------- .docx export ---------- */
  function exportDocx(){
    if(typeof window.docx === 'undefined' || !window.docx.Document){
      alert('Word export library is still loading — please try again in a moment.');
      return;
    }
    var wb = buildWorkbook();
    var D = window.docx;
    var children = [];

    children.push(new D.Paragraph({
      children: [new D.TextRun({ text: wb.pageTitleEn, bold:true, size: 36, color:'1B2A4A' })],
      spacing: { after: 80 }
    }));
    if(wb.subtitleEn){
      children.push(new D.Paragraph({
        children: [new D.TextRun({ text: wb.subtitleEn, size: 20, color:'1A5C5C' })],
        spacing: { after: 200 }
      }));
    }
    children.push(new D.Paragraph({
      children: [
        new D.TextRun({ text: 'Student: ', bold:true, size: 22 }),
        new D.TextRun({ text: wb.studentName, size: 22 }),
        new D.TextRun({ text: '   Date: ', bold:true, size: 22 }),
        new D.TextRun({ text: formatDate(wb.timestamp), size: 22 })
      ],
      spacing: { after: 300 }
    }));

    function runToTextRun(r){
      return new D.TextRun({
        text: r.text || '',
        bold: !!r.bold, italics: !!r.italic,
        underline: r.underline ? {} : undefined,
        highlight: r.highlight ? 'yellow' : undefined,
        size: 22
      });
    }

    wb.sections.forEach(function(sec){
      children.push(new D.Paragraph({
        children: [new D.TextRun({ text: sec.heading, bold:true, size: 28, color:'1B2A4A' })],
        spacing: { before: 300, after: 120 },
        border: { bottom: { color:'1B2A4A', space:2, value:'single', size:8 } }
      }));
      sec.blocks.forEach(function(block){
        if(block.type === 'ul' || block.type === 'ol'){
          block.items.forEach(function(runs){
            children.push(new D.Paragraph({
              children: runs.map(runToTextRun),
              bullet: block.type === 'ul' ? { level: 0 } : undefined,
              numbering: block.type === 'ol' ? { reference:'numlist', level: 0 } : undefined
            }));
          });
        } else if(block.type === 'h2' || block.type === 'h3'){
          children.push(new D.Paragraph({
            children: block.runs.map(function(r){
              return new D.TextRun({ text: r.text, bold:true, size: block.type === 'h2' ? 24 : 22, color:'1A5C5C' });
            }),
            spacing: { before: 200, after: 80 }
          }));
        } else {
          children.push(new D.Paragraph({
            children: block.runs.map(runToTextRun),
            spacing: { after: 100 }
          }));
        }
      });
    });

    var doc = new D.Document({
      creator: 'WMSI',
      title: wb.pageTitleEn + ' — ' + wb.studentName,
      styles: { default: { document: { run: { font: 'Calibri' } } } },
      numbering: {
        config: [{ reference: 'numlist',
          levels: [{ level:0, format:'decimal', text:'%1.', alignment:'start' }] }]
      },
      sections: [{
        properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
        children: children
      }]
    });

    D.Packer.toBlob(doc).then(function(blob){
      var filename = wb.filenameStem + '_' + safeFilename(wb.studentName) + '.docx';
      if(window.saveAs){ window.saveAs(blob, filename); }
      else {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = filename; document.body.appendChild(a); a.click();
        setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      }
    }).catch(function(err){ alert('Word export failed: ' + err.message); });
  }

  /* ---------- PDF export (selectable-text via jsPDF) ---------- */
  function exportPdf(){
    if(!window.jspdf || !window.jspdf.jsPDF){
      alert('PDF library is still loading — please try again in a moment.');
      return;
    }
    var wb = buildWorkbook();
    var doc = new window.jspdf.jsPDF({ unit:'pt', format:'a4' });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var marginX = 54, marginY = 54;
    var maxW = pageW - marginX * 2;
    var y = marginY;

    function ensureRoom(needed){
      if(y + needed > pageH - marginY){ doc.addPage(); y = marginY; }
    }
    function setFont(bold, italic){
      var style = (bold && italic) ? 'bolditalic' : bold ? 'bold' : italic ? 'italic' : 'normal';
      doc.setFont('helvetica', style);
    }
    function writeRuns(runs, size, indent){
      indent = indent || 0;
      doc.setFontSize(size);
      var lineWidth = maxW - indent;
      var words = [];
      runs.forEach(function(r){
        if(!r.text) return;
        var parts = r.text.split(/(\s+)/);
        parts.forEach(function(p){
          if(p === '') return;
          words.push({ text: p, bold: r.bold, italic: r.italic, underline: r.underline, highlight: r.highlight });
        });
      });
      var lineTokens = [], lineLen = 0;
      function flushLine(){
        if(lineTokens.length === 0) return;
        ensureRoom(size + 4);
        var x = marginX + indent;
        var tempX = x;
        lineTokens.forEach(function(tok){
          setFont(tok.bold, tok.italic);
          var w = doc.getTextWidth(tok.text);
          if(tok.highlight && tok.text.trim()){
            doc.setFillColor(255, 243, 184);
            doc.rect(tempX, y - size + 3, w, size + 2, 'F');
          }
          tempX += w;
        });
        tempX = x;
        lineTokens.forEach(function(tok){
          setFont(tok.bold, tok.italic);
          doc.setTextColor(32, 40, 58);
          doc.text(tok.text, tempX, y);
          var w = doc.getTextWidth(tok.text);
          if(tok.underline && tok.text.trim()){
            doc.setDrawColor(32,40,58);
            doc.line(tempX, y + 1.5, tempX + w, y + 1.5);
          }
          tempX += w;
        });
        y += size + 4;
        lineTokens = []; lineLen = 0;
      }
      words.forEach(function(tok){
        setFont(tok.bold, tok.italic);
        var w = doc.getTextWidth(tok.text);
        if(tok.text === '\n'){ flushLine(); return; }
        if(lineLen + w > lineWidth && lineTokens.length && tok.text.trim() !== ''){
          flushLine();
          if(/^\s+$/.test(tok.text)) return;
        }
        lineTokens.push(tok); lineLen += w;
      });
      flushLine();
    }

    // Header
    doc.setTextColor(27, 42, 74); doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
    ensureRoom(24); doc.text(wb.pageTitleEn, marginX, y); y += 24;
    if(wb.subtitleEn){
      doc.setFont('helvetica','normal'); doc.setFontSize(11); doc.setTextColor(26, 92, 92);
      doc.text(wb.subtitleEn, marginX, y); y += 20;
    }
    doc.setTextColor(32, 40, 58); doc.setFontSize(11);
    doc.setFont('helvetica','bold'); doc.text('Student: ', marginX, y);
    doc.setFont('helvetica','normal'); doc.text(wb.studentName, marginX + doc.getTextWidth('Student: '), y);
    var midX = marginX + 260;
    doc.setFont('helvetica','bold'); doc.text('Date: ', midX, y);
    doc.setFont('helvetica','normal'); doc.text(formatDate(wb.timestamp), midX + doc.getTextWidth('Date: '), y);
    y += 24;

    wb.sections.forEach(function(sec){
      ensureRoom(30);
      doc.setDrawColor(27, 42, 74); doc.setLineWidth(1);
      doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor(27, 42, 74);
      doc.text(sec.heading, marginX, y);
      doc.line(marginX, y + 3, pageW - marginX, y + 3);
      y += 18;
      sec.blocks.forEach(function(block){
        if(block.type === 'ul' || block.type === 'ol'){
          block.items.forEach(function(runs, i){
            var bullet = block.type === 'ul' ? '• ' : (i+1) + '. ';
            var withBullet = [{text: bullet, bold:false, italic:false, underline:false, highlight:false}].concat(runs);
            writeRuns(withBullet, 11, 12);
          });
        } else if(block.type === 'h2' || block.type === 'h3'){
          ensureRoom(20); doc.setTextColor(26, 92, 92);
          writeRuns(block.runs.map(function(r){ return Object.assign({}, r, {bold:true}); }), 12, 0);
          y += 2;
        } else {
          doc.setTextColor(32, 40, 58);
          writeRuns(block.runs, 11, 0);
          y += 4;
        }
      });
      y += 8;
    });

    var filename = wb.filenameStem + '_' + safeFilename(wb.studentName) + '.pdf';
    doc.save(filename);
  }

  function withBusy(sel, fn){
    var btn = document.querySelector(sel);
    if(!btn) { fn(); return; }
    var origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="en">Preparing…</span><span class="zh">正在生成…</span>';
    setTimeout(function(){
      try { fn(); }
      catch(err){ alert('Export failed: ' + err.message); console.error(err); }
      finally {
        setTimeout(function(){ btn.disabled = false; btn.innerHTML = origHtml; }, 400);
      }
    }, 30);
  }

  /* ---------- Installation (idempotent) + setPage ---------- */
  var installed = false;

  function install(){
    if(installed) return;
    installed = true;

    // Build panel DOM once
    var built = buildPanel();
    editorEl = document.getElementById('wne-editor');
    statusEl = document.getElementById('wne-status');

    // Wire toolbar
    built.panel.querySelector('.wne-toolbar').addEventListener('click', function(e){
      var b = e.target.closest('button[data-cmd]');
      if(!b) return;
      editorEl.focus();
      var cmd = b.getAttribute('data-cmd');
      var arg = b.getAttribute('data-arg') || null;
      try {
        if(cmd === 'highlight') document.execCommand('backColor', false, '#FFF3B8');
        else document.execCommand(cmd, false, arg);
      } catch(err){}
      saveNotes();
    });
    editorEl.addEventListener('input', saveNotes);

    // Open/close
    built.fab.addEventListener('click', openPanel);
    built.panel.querySelector('.wne-close').addEventListener('click', closePanel);
    built.backdrop.addEventListener('click', closePanel);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && built.panel.classList.contains('open')) closePanel();
    });

    // Export button delegation — reads CFG dynamically each click
    document.addEventListener('click', function(e){
      if(!CFG || !e.target || !e.target.closest) return;
      if(CFG.exportDocxSelector && e.target.closest(CFG.exportDocxSelector)){
        withBusy(CFG.exportDocxSelector, exportDocx);
      } else if(CFG.exportPdfSelector && e.target.closest(CFG.exportPdfSelector)){
        withBusy(CFG.exportPdfSelector, exportPdf);
      } else if(CFG.openNotesSelector && e.target.closest(CFG.openNotesSelector)){
        openPanel();
      }
    });
  }

  function setPage(config){
    install();
    CFG = config || {};
    NOTES_KEY = STORAGE_PREFIX + CFG.toolId + '_notes';

    // Restore notes for this page's toolId
    var saved = lsGet(NOTES_KEY);
    editorEl.innerHTML = saved || '';
    statusEl.innerHTML = '<span class="en">Not saved yet</span><span class="zh">尚未保存</span>';

    // Persist declared static fields (standalone HTML pages use this)
    if(Array.isArray(CFG.persist)) CFG.persist.forEach(persistFieldConfig);
  }

  // Legacy convenience: install + setPage together (standalone HTML pages call this)
  function init(config){ setPage(config); }

  /* ---------- Generic auto-collect for legacy HTML tools ----------
     Scans the current DOM for filled textareas and toggled checkboxes,
     bundling them into a single "Your work" section. Pages that want
     something more curated should pass their own collect() instead. */
  function autoCollect(){
    var sections = [];
    var workBlocks = [];

    // Textareas — group by nearest <label> or ancestor with a heading
    Array.prototype.forEach.call(document.querySelectorAll('textarea'), function(ta, i){
      var v = (ta.value || '').trim();
      if(!v) return;
      // Skip our own export-code textareas etc.
      if(ta.id === 'exportCode' || ta.id === 'export-output' || ta.readOnly) return;
      var label = findNearbyLabel(ta) || ta.placeholder || ('Textarea ' + (i+1));
      workBlocks.push(p([text(label + ':', {bold:true})]));
      workBlocks.push(p(v));
    });

    // Checkboxes — one line per checked box, grouped by nearest heading
    var checkedItems = [];
    Array.prototype.forEach.call(document.querySelectorAll('input[type="checkbox"]'), function(cb){
      var label = findNearbyLabel(cb);
      if(!label) return;
      checkedItems.push({ label: label, checked: cb.checked });
    });
    if(checkedItems.length){
      if(workBlocks.length) workBlocks.push(h(3, 'Self-check'));
      var done = checkedItems.filter(function(i){ return i.checked; }).length;
      workBlocks.push(p([text(done + ' of ' + checkedItems.length + ' ticked', {bold:true})]));
      checkedItems.forEach(function(item){
        workBlocks.push(p((item.checked ? '☑ ' : '☐ ') + item.label));
      });
    }

    if(workBlocks.length) sections.push({ heading: 'Your work', blocks: workBlocks });
    return { sections: sections };
  }

  function findNearbyLabel(el){
    // Look for enclosing <label>
    var parent = el.parentElement;
    while(parent && parent.tagName !== 'LABEL' && parent.tagName !== 'BODY'){
      parent = parent.parentElement;
    }
    if(parent && parent.tagName === 'LABEL'){
      var text = (parent.textContent || '').trim();
      if(text) return text.slice(0, 200);
    }
    // Look for <label for=id>
    if(el.id){
      var lbl = document.querySelector('label[for="' + el.id + '"]');
      if(lbl){ var t = (lbl.textContent || '').trim(); if(t) return t.slice(0, 200); }
    }
    // Sibling <p> or heading immediately before
    var sib = el.previousElementSibling;
    while(sib){
      if(/^(P|H1|H2|H3|H4|H5|H6|SPAN|DIV)$/.test(sib.tagName)){
        var text2 = (sib.textContent || '').trim();
        if(text2 && text2.length < 240) return text2;
      }
      sib = sib.previousElementSibling;
    }
    return null;
  }

  window.WMSI_Notes = {
    install: install,
    setPage: setPage,
    init: init,
    text: text, p: p, h: h, ul: ul, ol: ol,
    notesBlocks: notesBlocks,
    autoCollect: autoCollect,
    loadField: loadField, saveField: saveField,
    openPanel: openPanel, closePanel: closePanel,
    exportDocx: exportDocx, exportPdf: exportPdf
  };
})();
