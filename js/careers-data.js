/* =============================================================================
   EnhanceBiz — JOB OPENINGS
   -----------------------------------------------------------------------------
   ▸ TO ADD an opening:  copy one { ... } block, change the fields, save. Done.
   ▸ TO REMOVE one:      delete its { ... } block.
   ▸ Keep a comma between each block. The Careers page updates automatically.

   Fields (all optional except title):
     title     — the job title                        (required)
     dept      — department, shown as a chip           e.g. "Data Operations"
     type      — employment type, shown as a chip      e.g. "Full-time"
     location  — location, shown as a chip             e.g. "Remote / Hybrid"
     tags      — extra chips, an array                 e.g. ["Python", "LiDAR"]
     detail    — an optional one-line description under the title
     apply     — optional custom apply link. If set (e.g. an ATS or Google Form
                 URL), the Apply button links straight there and skips the built-in
                 application form.  e.g. apply: "https://forms.gle/your-form"
   ============================================================================= */

/* Where the built-in application form (with resume upload) sends submissions.
   Leave "" to fall back to email (opens the visitor's mail app, pre-filled).
   To capture applications + resumes online, paste a form endpoint here, e.g. a
   Formspree URL:  window.EB_APPLY_ENDPOINT = "https://formspree.io/f/xxxxxxx"; */
window.EB_APPLY_ENDPOINT = "";

/* Show the on-page "＋ Add opening" authoring tool to everyone?
   false = hidden from the public (recommended). You still unlock it privately by
           visiting  careers.html?admin=1  once — it then stays on in YOUR browser.
   true  = the Add button shows for every visitor (only use while building).
   NOTE: this is a convenience toggle, not security. Real publishing still requires
   editing this file / your host. */
window.EB_ADMIN = false;

window.EB_JOBS = [

  {
    title: "Data Annotator",
    dept: "Data Operations",
    type: "Full-time",
    location: "Remote / Hybrid",
    detail: "Label image, video & 3D data to a high QA bar."
  },

  {
    title: "NLP / Linguistic Specialist",
    dept: "Data Operations",
    type: "Full-time",
    location: "Remote",
    tags: ["Multilingual"],
    detail: "Entity, sentiment & intent annotation for language models."
  },

  {
    title: "QA Reviewer",
    dept: "Quality",
    type: "Full-time",
    location: "Remote",
    detail: "Validate and sign off on annotation quality."
  },

  {
    title: "Full-Stack Engineer",
    dept: "Product",
    type: "Full-time",
    location: "Remote",
    tags: ["React", "Node"],
    detail: "Build the AnnotateMe platform."
  },

  {
    title: "Customer Support Associate",
    dept: "Customer Experience",
    type: "Full-time",
    location: "On-site / Hybrid",
    detail: "Inbound & outbound support for our clients."
  },

  {
    title: "Project Manager",
    dept: "Delivery",
    type: "Full-time",
    location: "Client-facing",
    detail: "Own annotation delivery end to end."
  }

  // ── COPY THE BLOCK BELOW TO ADD A NEW ROLE (remove the // at the start of each line) ──
  // ,{
  //   title: "Your New Role",
  //   dept: "Team",
  //   type: "Full-time",
  //   location: "Remote",
  //   tags: ["Skill A", "Skill B"],
  //   detail: "One-line description of the role."
  // }

];
