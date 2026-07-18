/* ==========================================================================
   EnhanceBiz Assistant — self-contained chat widget
   --------------------------------------------------------------------------
   • Zero dependencies. Injects its own DOM + is seeded with an EnhanceBiz
     knowledge base so it works instantly on a static site (no API key).
   • To later power it with a real LLM (e.g. Claude), set:
        window.EB_CHAT_ENDPOINT = 'https://your-backend/api/chat';
     and implement a small server proxy that calls the Claude API
     (model: claude-sonnet-4-6) with the EB_KNOWLEDGE string as system
     context. When the endpoint is set, askLLM() is used and the local
     keyword engine becomes the offline fallback.
   ========================================================================== */
(function () {
  'use strict';

  // -------- Knowledge base (also usable as LLM system context) --------
  var EB_KNOWLEDGE = 'EnhanceBiz provides human-curated data services for AI: data annotation (image, video, text, 3D LiDAR), NLP & linguistic services, AI/ML dataset support (curation, augmentation, RLHF, validation), and BPO/customer support. Its flagship product is AnnotateMe, an AI-assisted annotation platform.';

  var KB = [
    {
      keys: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
      answer: "Hi there! 👋 I'm the EnhanceBiz assistant. I can tell you about our <strong>data annotation</strong>, <strong>NLP</strong>, <strong>AI/ML dataset</strong> and <strong>BPO</strong> services — or our platform, <strong>AnnotateMe</strong>. What would you like to know?"
    },
    {
      keys: ['annotateme', 'annotate me', 'platform', 'product', 'tool', 'software'],
      answer: "<strong>AnnotateMe</strong> is our AI-assisted annotation platform. Highlights:<ul><li>YOLOv8 AI auto-annotation (single frame or batch)</li><li>Real-time multi-annotator collaboration</li><li>3-stage quality review workflow</li><li>Image, video, text &amp; 3D point-cloud support</li><li>Export to 9+ formats (COCO, YOLO, VOC, TFRecord…)</li><li>Multi-tenant, self-hosted or managed</li></ul>See the full <a href='annotateme.html'>AnnotateMe page</a> or <a href='contact.html'>request a demo</a>."
    },
    {
      keys: ['annotation', 'annotate', 'labeling', 'labelling', 'bounding box', 'segmentation', 'label data'],
      answer: "Our <strong>Data Annotation Services</strong> cover:<ul><li>Bounding boxes &amp; polygons</li><li>Semantic &amp; instance segmentation</li><li>Keypoints &amp; landmarks</li><li>Video object tracking</li><li>3D LiDAR point-cloud cuboids</li></ul>All QA-verified through our review workflow. More on the <a href='data-annotations.html'>Data Annotation page</a>."
    },
    {
      keys: ['nlp', 'text', 'language', 'ner', 'sentiment', 'transcription', 'translation', 'linguistic', 'speech'],
      answer: "Our <strong>NLP &amp; Linguistic Services</strong> include named entity recognition (NER), sentiment &amp; intent labeling, POS tagging, audio transcription, and translation across dozens of languages. Details on the <a href='services.html#nlp'>Services page</a>."
    },
    {
      keys: ['ml', 'ai/ml', 'dataset', 'rlhf', 'augmentation', 'curation', 'training data', 'fine-tun', 'model'],
      answer: "Our <strong>AI/ML Dataset Support</strong> covers dataset design, data curation &amp; augmentation, model validation, and <strong>RLHF</strong> human-preference data for LLM alignment. See <a href='services.html#aiml'>AI/ML Dataset Support</a>."
    },
    {
      keys: ['bpo', 'call center', 'call centre', 'customer support', 'technical support', 'outsourcing', 'back office'],
      answer: "Yes — alongside AI data services, EnhanceBiz runs full <strong>BPO &amp; Customer Support</strong>: inbound &amp; outbound call centers, technical support, and back-office outsourcing. More on the <a href='services.html#bpo'>Services page</a>."
    },
    {
      keys: ['format', 'export', 'coco', 'yolo', 'voc', 'tfrecord', 'cvat', 'datumaro', 'label studio'],
      answer: "AnnotateMe exports to <strong>9+ formats</strong>: COCO JSON, YOLO, Pascal VOC, TensorFlow Record, Label Studio, CVAT XML, Datumaro, MOT CSV, and native AnnotateMe JSON. No format lock-in."
    },
    {
      keys: ['use case', 'industry', 'autonomous', 'healthcare', 'medical', 'retail', 'generative', 'computer vision', 'vehicle'],
      answer: "We support AI across industries: <strong>autonomous vehicles</strong> (LiDAR/lane data), <strong>healthcare</strong> (medical imaging), <strong>generative &amp; conversational AI</strong> (RLHF, intent), <strong>retail</strong>, <strong>computer vision</strong>, and <strong>smart CX</strong>. See <a href='services.html#usecases'>Use Cases</a>."
    },
    {
      keys: ['security', 'compliance', 'privacy', 'gdpr', 'data protection', 'secure', 'audit'],
      answer: "Security is built in: <strong>tenant-isolated storage</strong>, role-based access, JWT auth, HMAC-signed webhooks, and an <strong>immutable audit trail</strong> on every change. Happy to discuss your specific compliance needs — <a href='contact.html'>contact us</a>."
    },
    {
      keys: ['price', 'pricing', 'cost', 'quote', 'how much', 'budget', 'rate'],
      answer: "Pricing depends on data type, volume, and whether you want a <strong>managed service</strong> or a <strong>self-hosted AnnotateMe</strong> deployment. Tell us about your project and we'll prepare a tailored quote — <a href='contact.html'>request a quote</a>."
    },
    {
      keys: ['demo', 'trial', 'try', 'get started', 'start', 'onboard'],
      answer: "Great! You can <a href='contact.html'>request a demo or consultation here</a>. Share your dataset size, data type, and goals, and our team will reach out within one business day."
    },
    {
      keys: ['contact', 'email', 'phone', 'reach', 'talk to', 'sales', 'call you'],
      answer: "You can reach us at <a href='mailto:shiwesh@enhancebizcx.com'>shiwesh@enhancebizcx.com</a> or via <a href='https://www.linkedin.com/in/enhancebiz-cx-770709415/' target='_blank'>LinkedIn</a>. Or use the <a href='contact.html'>contact form</a> and we'll get back to you quickly."
    },
    {
      keys: ['career', 'job', 'hiring', 'work', 'apply', 'vacancy', 'employment'],
      answer: "We're always looking for great annotators, linguists, and engineers. Check open roles on our <a href='careers.html'>Careers page</a>."
    },
    {
      keys: ['about', 'who are you', 'company', 'enhancebiz'],
      answer: "<strong>EnhanceBiz</strong> powers AI with high-quality, human-curated data — combining annotation, NLP, and AI/ML dataset services with our own AnnotateMe platform and a BPO heritage. Learn more on our <a href='about.html'>About page</a>."
    },
    {
      keys: ['thank', 'thanks', 'cheers', 'appreciate'],
      answer: "You're welcome! 🙌 Anything else I can help you with about our services or AnnotateMe?"
    }
  ];

  var CHIPS = [
    { label: 'What is AnnotateMe?', q: 'Tell me about AnnotateMe' },
    { label: 'Annotation services', q: 'What annotation services do you offer?' },
    { label: 'Export formats', q: 'What export formats are supported?' },
    { label: 'Request a demo', q: 'I want a demo' },
    { label: 'Pricing', q: 'How does pricing work?' }
  ];

  var FALLBACK = "I'm not certain about that one, but our team can definitely help. You can <a href='contact.html'>reach out here</a> or ask me about <strong>annotation</strong>, <strong>NLP</strong>, <strong>AI/ML datasets</strong>, <strong>BPO</strong>, or <strong>AnnotateMe</strong>.";

  // -------- Local keyword matcher --------
  function findAnswer(text) {
    var t = ' ' + text.toLowerCase() + ' ';
    var best = null, bestScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      item.keys.forEach(function (k) { if (t.indexOf(k) !== -1) score += k.length; });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best ? best.answer : FALLBACK;
  }

  // -------- Optional LLM hook (used if EB_CHAT_ENDPOINT is set) --------
  function askLLM(text) {
    return fetch(window.EB_CHAT_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, context: EB_KNOWLEDGE })
    }).then(function (r) { return r.json(); }).then(function (d) { return d.reply || d.answer; });
  }

  // -------- Build UI --------
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

  var launcher = el('<button class="ebc-launch" aria-label="Open chat"><span class="ebc-pulse"></span><i class="fa fa-comment"></i> Ask us anything</button>');
  var panel = el(
    '<div class="ebc-panel" role="dialog" aria-label="EnhanceBiz assistant">' +
      '<div class="ebc-head">' +
        '<div class="ebc-head__avatar"><i class="fa fa-magic"></i></div>' +
        '<div class="ebc-head__t"><div class="ebc-head__name">EnhanceBiz Assistant</div><div class="ebc-head__status">Online · replies instantly</div></div>' +
        '<button class="ebc-head__close" aria-label="Close"><i class="fa fa-times"></i></button>' +
      '</div>' +
      '<div class="ebc-body" id="ebcBody"></div>' +
      '<div class="ebc-chips" id="ebcChips"></div>' +
      '<div class="ebc-input"><input id="ebcInput" type="text" placeholder="Ask about our services or AnnotateMe…" autocomplete="off"><button id="ebcSend" aria-label="Send"><i class="fa fa-paper-plane"></i></button></div>' +
      '<div class="ebc-foot">Powered by EnhanceBiz · <a href="contact.html" style="color:inherit;text-decoration:underline;">talk to a human</a></div>' +
    '</div>'
  );

  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var body = panel.querySelector('#ebcBody');
  var chipWrap = panel.querySelector('#ebcChips');
  var input = panel.querySelector('#ebcInput');

  function scroll() { body.scrollTop = body.scrollHeight; }

  function addMsg(html, who) {
    var m = el('<div class="ebc-msg ' + who + '"></div>');
    m.innerHTML = html;
    body.appendChild(m); scroll();
  }

  function typing(on) {
    var t = body.querySelector('.ebc-typing');
    if (on && !t) { body.appendChild(el('<div class="ebc-typing"><span></span><span></span><span></span></div>')); scroll(); }
    else if (!on && t) { t.remove(); }
  }

  function respond(text) {
    typing(true);
    var delay = 500 + Math.min(text.length * 12, 900);
    var done = function (answer) { typing(false); addMsg(answer, 'bot'); };
    setTimeout(function () {
      if (window.EB_CHAT_ENDPOINT) {
        askLLM(text).then(done).catch(function () { done(findAnswer(text)); });
      } else {
        done(findAnswer(text));
      }
    }, delay);
  }

  function send(text) {
    text = (text || input.value).trim();
    if (!text) return;
    addMsg(text.replace(/</g, '&lt;'), 'user');
    input.value = '';
    respond(text);
  }

  function renderChips() {
    chipWrap.innerHTML = '';
    CHIPS.forEach(function (c) {
      var chip = el('<button class="ebc-chip">' + c.label + '</button>');
      chip.addEventListener('click', function () { send(c.q); });
      chipWrap.appendChild(chip);
    });
  }

  // -------- Interactions --------
  var opened = false;
  function open() {
    panel.classList.add('open'); launcher.classList.add('hidden');
    if (!opened) {
      opened = true;
      setTimeout(function () { addMsg(KB[0].answer, 'bot'); renderChips(); }, 250);
    }
    setTimeout(function () { input.focus(); }, 320);
  }
  function close() { panel.classList.remove('open'); launcher.classList.remove('hidden'); }

  launcher.addEventListener('click', open);
  panel.querySelector('.ebc-head__close').addEventListener('click', close);
  panel.querySelector('#ebcSend').addEventListener('click', function () { send(); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

  // Expose a tiny API (optional external use)
  window.EBChat = { open: open, close: close, ask: send, knowledge: EB_KNOWLEDGE };
})();
