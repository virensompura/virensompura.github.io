# Blog Management Guide

## How to Add a New Blog Post

### Step 1: Create the Blog HTML File

1. Copy `_TEMPLATE.html` to a new file (e.g., `my-new-post.html`)
2. Edit the file and update:
   - `<title>` tag
   - Category label (`.section-label`)
   - Blog title (`.section-title`)
   - Author/date/read time (`.section-sub`)
   - Emoji icon in the TOC
   - All content in `<article class="post-body">`

### Step 2: Add Entry to Blog Index (`blog/index.html`)

Add a new `<a class="blog-card">` entry in the `.blog-index-grid` div:

```html
<a class="blog-card reveal" href="my-new-post.html">
  <div class="blog-thumb">📝</div>  <!-- Choose an emoji -->
  <div class="blog-body">
    <div class="blog-meta-row">
      <span class="blog-cat">CATEGORY</span>
      <span class="blog-date">Month YYYY</span>
      <span class="blog-read">X min read</span>
    </div>
    <div class="blog-title">Your Blog Title Here</div>
    <div class="blog-excerpt">A brief description of what this article covers...</div>
    <div class="blog-arrow">Read Article →</div>
  </div>
</a>
```

### Step 3: Add Entry to Main Site (`../index.html`)

Find the `BLOGS` array in the `<script>` section and add:

```javascript
{
  id:'my-new-post',
  emoji:'📝',
  category:'CATEGORY',
  date:'Month YYYY',
  readTime:'X min read',
  title:'Your Blog Title Here',
  excerpt:'A brief description...',
  content:`
    <!-- Your HTML content here -->
  `
},
```

## File Structure

```
blog/
├── _TEMPLATE.html      # Copy this for new posts
├── README.md           # This file
├── index.html          # Blog listing page
├── ros2-install.html   # Individual blog post
├── nodes-topics.html   # Individual blog post
├── nav2.html           # Individual blog post
├── isaac-sim.html      # Individual blog post
├── slam-deep.html      # Individual blog post
└── microros.html       # Individual blog post
```

## Tips

- Keep filenames lowercase with hyphens (e.g., `my-new-topic.html`)
- Use semantic emojis that represent the content (🤖 for robots, ⚡ for performance, etc.)
- Estimate read time: ~200-250 words per minute
- Categories: ROS2, Navigation, SLAM, Simulation, Embedded, etc.
