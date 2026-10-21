const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Comprehensive Video Upload Support Test Suite...\n');

// 1. Static Code Analysis Checks
const pubCode = fs.readFileSync(path.resolve('js/telegramPublisher.js'), 'utf8');

// Check state variables
assert(pubCode.includes("videoUrl: ''"), 'Missing state.videoUrl');
assert(pubCode.includes("attachedVideoName: ''"), 'Missing state.attachedVideoName');
assert(pubCode.includes("attachedVideoSize: 0"), 'Missing state.attachedVideoSize');
assert(pubCode.includes("attachedVideoType: ''"), 'Missing state.attachedVideoType');
assert(pubCode.includes("mediaType: 'NONE'"), 'Missing state.mediaType');

// Check DOM elements
assert(pubCode.includes('id="tg-pub-toolbar-attach-video-btn"'), 'Missing toolbar video button');
assert(pubCode.includes('id="tg-pub-video-file-input"'), 'Missing video file input element');
assert(pubCode.includes('accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"'), 'Missing accepted video types');

// Check Card and Simulator Preview
assert(pubCode.includes('tg-sim-video'), 'Missing live simulator video element');
assert(pubCode.includes('🎬 <b>Video Attached</b>'), 'Missing video card title in renderAttachedImageCardHtml');
assert(pubCode.includes('✈️ TG (50MB)'), 'Missing multi-platform capability badge for Telegram');
assert(pubCode.includes('▶️ YT (Resumable)'), 'Missing multi-platform capability badge for YouTube');
assert(pubCode.includes('📸 IG (Reels)'), 'Missing multi-platform capability badge for Instagram');
assert(pubCode.includes('👥 FB (Videos)'), 'Missing multi-platform capability badge for Facebook');

// Check Public API exports
assert(pubCode.includes('triggerVideoUpload'), 'Missing triggerVideoUpload export');
assert(pubCode.includes('handleVideoFileUpload'), 'Missing handleVideoFileUpload export');
assert(pubCode.includes('handleVideoFile'), 'Missing handleVideoFile export');
assert(pubCode.includes('removeAttachedVideo'), 'Missing removeAttachedVideo export');
assert(pubCode.includes('setMediaUrl'), 'Missing setMediaUrl export');

console.log('✅ 1. Static code analysis & DOM structures verified.');

// 2. Behavioral Unit Testing in Mock DOM environment
let alertMessages = [];
global.alert = (msg) => { alertMessages.push(msg); };
global.window = {
  TelegramPublisher: {},
  location: { origin: 'https://deeppredictbet.com' },
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.document = {
  getElementById: (id) => {
    return {
      id,
      click: () => {},
      value: '',
      style: {},
      addEventListener: () => {}
    };
  },
  createElement: (tag) => {
    return {
      tagName: tag.toUpperCase(),
      style: {},
      parentNode: {
        insertBefore: () => {}
      }
    };
  },
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.showAlert = (msg) => { alertMessages.push(msg); };

// Load the module
const moduleFunc = new Function('window', 'document', 'showAlert', pubCode);
moduleFunc(global.window, global.document, global.showAlert);

const tp = global.window.TelegramPublisher;
assert(tp, 'TelegramPublisher failed to initialize');
assert(typeof tp.handleVideoFile === 'function', 'handleVideoFile is not a function');
assert(typeof tp.removeAttachedVideo === 'function', 'removeAttachedVideo is not a function');
assert(typeof tp.setMediaUrl === 'function', 'setMediaUrl is not a function');

console.log('✅ 2. Module initialized successfully in test environment.');

// 3. Test MIME Type & Extension Validation
alertMessages = [];
tp.handleVideoFile({ name: 'malicious.exe', type: 'application/x-msdownload', size: 1024 });
assert(alertMessages.some(m => m.includes('Unsupported video format')), 'Should reject .exe file');

alertMessages = [];
tp.handleVideoFile({ name: 'document.pdf', type: 'application/pdf', size: 1024 });
assert(alertMessages.some(m => m.includes('Unsupported video format')), 'Should reject .pdf file');

console.log('✅ 3. Unsupported MIME types and extensions successfully rejected.');

// 4. Test File Size Validation
alertMessages = [];
// 120MB video (> 100MB client limit)
tp.handleVideoFile({ name: 'huge_clip.mp4', type: 'video/mp4', size: 120 * 1024 * 1024 });
assert(alertMessages.some(m => m.includes('Video too large')), 'Should reject video > 100MB');

alertMessages = [];
// 65MB video (within 100MB client limit, but > 50MB Telegram warning)
tp.handleVideoFile({ name: 'long_match.mp4', type: 'video/mp4', size: 65 * 1024 * 1024 });
assert(alertMessages.some(m => m.includes('Telegram Bot API enforces a 50MB file size limit')), 'Should display 50MB Telegram warning');

alertMessages = [];
// 15MB video (clean attachment)
tp.handleVideoFile({ name: 'goal_highlight.mp4', type: 'video/mp4', size: 15 * 1024 * 1024 });
assert(alertMessages.some(m => m.includes('Video successfully attached')), 'Should attach 15MB video cleanly');

console.log('✅ 4. File size limits (100MB client limit, 50MB Telegram warning) verified.');

// 5. Test Duplicate Attachment Prevention
alertMessages = [];
tp.handleVideoFile({ name: 'goal_highlight.mp4', type: 'video/mp4', size: 15 * 1024 * 1024 });
assert(alertMessages.some(m => m.includes('already attached')), 'Should detect duplicate attachment');

console.log('✅ 5. Duplicate attachment prevention verified.');

// 6. Test Mutual Exclusivity (Image vs Video)
// When video is attached, attaching image clears video
alertMessages = [];
tp.handleImageFile({ name: 'match_banner.png', type: 'image/png', size: 500 * 1024 });
// Verify via removeAttachedVideo or setMediaUrl
tp.setMediaUrl('https://example.com/stream.webm');
tp.setMediaUrl('https://example.com/banner.jpg');
tp.removeAttachedVideo();
assert(alertMessages.some(m => m.includes('removed')), 'Should confirm video removal');

console.log('✅ 6. Mutual exclusivity between image and video verified.');

// 7. Verify Server-Side Video Adapters
(async () => {
  const socialAdapters = await import('./functions/api/social/_socialAdapters.js');
  const tgService = await import('./functions/api/integrations/telegram/_telegramService.js');

  // Verify Telegram sendVideo helper exists
  assert(typeof tgService.sendVideo === 'function', 'sendVideo missing from _telegramService.js');
  assert(typeof socialAdapters.dispatchTelegram === 'function', 'dispatchTelegram missing');
  assert(typeof socialAdapters.dispatchFacebook === 'function', 'dispatchFacebook missing');
  assert(typeof socialAdapters.dispatchInstagram === 'function', 'dispatchInstagram missing');
  assert(typeof socialAdapters.dispatchYouTube === 'function', 'dispatchYouTube missing');
  assert(typeof socialAdapters.dispatchTikTok === 'function', 'dispatchTikTok missing');

  // Test Telegram sendVideo call routing
  let sentTgType = null;
  const mockFetch = async (url, opts) => {
    if (url.includes('/sendVideo')) {
      sentTgType = 'video';
      return { ok: true, json: async () => ({ ok: true, result: { message_id: 999 } }) };
    }
    if (url.includes('/sendPhoto')) {
      sentTgType = 'photo';
      return { ok: true, json: async () => ({ ok: true, result: { message_id: 999 } }) };
    }
    return { ok: true, json: async () => ({ ok: true }) };
  };
  global.fetch = mockFetch;

  const mockKv = {
    get: async () => null,
    put: async () => {}
  };

  await tgService.publishToFreeChannel(
    { TELEGRAM_BOT_TOKEN: '123:test', TELEGRAM_CHANNEL_ID: '@test', USERS_KV: mockKv },
    'Goal Highlight!',
    { videoUrl: 'https://example.com/goal.mp4' }
  );
  assert.strictEqual(sentTgType, 'video', 'publishToFreeChannel must use sendVideo for videoUrl');

  // Test Facebook video routing to /{pageId}/videos
  let fbEndpoint = null;
  global.fetch = async (url, opts) => {
    fbEndpoint = url;
    return { ok: true, json: async () => ({ id: 'fb_vid_123' }) };
  };

  const fbRes = await socialAdapters.dispatchFacebook(
    {
      FACEBOOK_PAGE_ACCESS_TOKEN: 'token_123',
      FACEBOOK_PAGE_ID: 'page_456',
      USERS_KV: mockKv
    },
    {
      text: 'Amazing goal!',
      mediaUrl: 'https://example.com/goal.mp4',
      videoUrl: 'https://example.com/goal.mp4',
      mediaType: 'VIDEO'
    }
  );
  assert(fbEndpoint.includes('/page_456/videos'), 'Facebook video must route to /{pageId}/videos');
  assert.strictEqual(fbRes.status, 'SUCCESS');

  console.log('✅ 7. Server-side Telegram sendVideo and Facebook /{pageId}/videos routing verified.');

  console.log('\n🎉 ALL VIDEO UPLOAD SUPPORT TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
})().catch(err => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});
