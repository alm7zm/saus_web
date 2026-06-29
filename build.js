'use strict';

const ejs  = require('ejs');
const fse  = require('fs-extra');
const path = require('path');

// ── PATHS ─────────────────────────────────────────────────────────────────── //
const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SRC  = path.join(ROOT, 'src');

// ── CSS FILES (reset + everything else in main.css) ───────────────────────── //
const CSS_BASE = [
  'css/reset.css',
  'css/main.css',
];

// ── LOAD DATA ─────────────────────────────────────────────────────────────── //
function loadData() {
  const dataDir = path.join(SRC, 'data');
  return {
    team:         fse.readJsonSync(path.join(dataDir, 'team.json')),
    vehicle:      fse.readJsonSync(path.join(dataDir, 'vehicles.json')),
    blog:         fse.readJsonSync(path.join(dataDir, 'blog.json')),
    sponsors:     fse.readJsonSync(path.join(dataDir, 'sponsors.json')),
    achievements: fse.readJsonSync(path.join(dataDir, 'achievements.json')),
  };
}

// ── RENDER HELPER ─────────────────────────────────────────────────────────── //
async function render(templatePath, outPath, locals) {
  const html = await ejs.renderFile(templatePath, locals, {
    views: [path.join(SRC, 'components'), path.join(SRC, 'pages')],
    root:  SRC,
  });
  await fse.outputFile(outPath, html);

  return html;
}

function htmlToText(html) {
  // Extract only the contents inside <main>...</main>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

  // If no <main> exists, fall back to the whole page
  const mainContent = mainMatch ? mainMatch[1] : html;

  return mainContent
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── MAIN BUILD ────────────────────────────────────────────────────────────── //
async function build() {
  console.log('\n🔨 Building SUAS competition website…\n');

  // 1. Clean dist/
  await fse.emptyDir(DIST);

  // 2. Copy static assets
  await fse.copy(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
  await fse.copy(path.join(ROOT, 'css'),    path.join(DIST, 'css'));
  await fse.copy(path.join(ROOT, 'js'),     path.join(DIST, 'js'));
  await fse.copy(path.join(SRC, 'data'),    path.join(DIST, 'data'));
  
  // 3. GitHub Pages: disable Jekyll processing
  await fse.outputFile(path.join(DIST, '.nojekyll'), '');

  // 4. Load all content
  const data = loadData();
  const { team, vehicle, blog, sponsors, achievements, } = data;
  const searchIndex = [];
  // 5. Render top-level pages
  const pages = [
    {
      template: 'index.ejs',
      out:      'index.html',
      page:     'home',
      title:    'Home',
      css:      CSS_BASE,
      extra:    { achievements, vehicle },
    },
    {
      template: 'team.ejs',
      out:      'team.html',
      page:     'team',
      title:    'Team',
      css:      CSS_BASE,
      extra:    {},
    },
    {
      template: 'vehicle.ejs',
      out:      'vehicle.html',
      page:     'vehicle',
      title:    vehicle.vehicle.name,
      css:      CSS_BASE,
      extra:    { vehicle },
    },
    {
      template: 'blog.ejs',
      out:      'blog.html',
      page:     'blog',
      title:    'Blog',
      css:      CSS_BASE,
      extra:    { blog },
    },
    {
      template: 'sponsors.ejs',
      out:      'sponsors.html',
      page:     'sponsors',
      title:    'Sponsors',
      css:      CSS_BASE,
      extra:    { sponsors, achievements },
    },
    {
      template: 'contact.ejs',
      out:      'contact.html',
      page:     'contact',
      title:    'Contact',
      css:      CSS_BASE,
      extra:    { achievements },
    },
  ];

  for (const p of pages) {
    const html = await render(
      path.join(SRC, 'pages', p.template),
      path.join(DIST, p.out),
      {
        team,
        currentPage: p.page,
        cssFiles:    p.css,
        rootPath:    '',
        ...p.extra,
      }
    );
    const text = htmlToText(html);

    searchIndex.push({
      title: p.title,
      url: '/' + p.out,
      content: text
    });

    console.log(`  ✓ dist/${p.out}`);
  }

  // 6. Generate team member pages
  const memberCss = CSS_BASE;
  for (const member of team.members) {
    const html = await render(
      path.join(SRC, 'pages', 'team-member.ejs'),
      path.join(DIST, 'team', `${member.slug}.html`),
      {
        team,
        member,
        currentPage: 'team',
        cssFiles:    memberCss,
        rootPath:    '../../',
      }
    );
    const text = htmlToText(html);

    searchIndex.push({
      title: member.name,
      url: '/team/' + member.slug + '.html',
      content: text
    });

    console.log(`  ✓ dist/team/${member.slug}.html`);
  }

  // 7. Generate blog post pages
  const postCss = CSS_BASE;
  for (let i = 0; i < blog.posts.length; i++) {
    const post     = blog.posts[i];
    const prevPost = i > 0 ? blog.posts[i - 1] : null;
    const nextPost = i < blog.posts.length - 1 ? blog.posts[i + 1] : null;
    const html = await render(
      path.join(SRC, 'pages', 'blog-post.ejs'),
      path.join(DIST, 'blog', `${post.slug}.html`),
      {
        team,
        post,
        prevPost,
        nextPost,
        currentPage: 'blog',
        cssFiles:    postCss,
        rootPath:    '../../',
      }
    );
    const text = htmlToText(html);

    searchIndex.push({
      title: post.title,
      url: '/blog/' + post.slug + '.html',
      content: text
    });

    console.log(`  ✓ dist/blog/${post.slug}.html`);
  }
  await fse.outputJson(
  path.join(DIST, 'data', 'index-search.json'),
  searchIndex,
  { spaces: 2 }
  );
  const totalPages = pages.length + team.members.length + blog.posts.length;
  console.log(`\n✅ Build complete — ${totalPages} pages generated in dist/\n`);
}

build().catch(err => {
  console.error('\n❌ Build failed:', err);
  process.exit(1);
});
