import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { 
  AccessibilitySettings, 
  MediaControls,
  useKeyboardNavigation,
  applyAccessibilitySettings 
} from './modules/ui-control';

// 後端 API 的網址
const API_URL = 'http://127.0.0.1:8000';

function AppContent() {
  const { theme, themeName, toggleTheme } = useTheme();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // 處理無障礙設定變更
  const handleAccessibilityChange = (settings) => {
    applyAccessibilitySettings(settings);
  };

  // 鍵盤導航支援
  useKeyboardNavigation({
    onPlay: () => {
      if (!loading && !ttsLoading) {
        handleTTS();
      }
    },
    onPause: () => {
      setIsPlaying(false);
    },
    onStop: () => {
      setIsPlaying(false);
      setIsScanning(false);
    },
    onScan: () => {
      if (!loading && !ttsLoading) {
        handleSubmit(new Event('submit'));
      }
    },
  }, true);

  const handleTTS = async () => {
    if (!text.trim()) {
      setError(t(language, 'placeholder'));
      return;
    }
    setTtsLoading(true);
    setIsPlaying(true);
    setError('');
    setAudioSrc('');

    try {
        const response = await fetch(`${API_URL}/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang: language })
        });

        if (!response.ok) {
            throw new Error(`TTS API error: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
    } catch (err) {
        setError(err.message);
        setIsPlaying(false);
    } finally {
        setTtsLoading(false);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsScanning(false);
    setAudioSrc('');
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setIsScanning(true);
    setError('');
    setResult(null);

    if (!text.trim()) {
      setError(t(language, 'placeholder'));
      setLoading(false);
      setIsScanning(false);
      return;
    }

    try {
      const requestBody = { text: text };
      // Include user profile in request if available
      if (userProfile) {
        requestBody.user_profile = userProfile;
      }
      
      const response = await fetch(`${API_URL}/generate_immersion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsScanning(false);
    }
  };

  // Handle adding to favorites
  const handleAddToFavorites = async () => {
    if (!currentUser?.user_id || !result) return;
    try {
      await fetch(`${API_URL}/bookmarks/${currentUser.user_id}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: `content_${Date.now()}`,
          content_type: 'immersion',
          title: text.slice(0, 50),
          description: text
        })
      });
    } catch (err) {
      console.error('Failed to add to favorites:', err);
    }
  };

  // Save reading session
  const saveReadingSession = async () => {
    if (!currentUser?.user_id) return;
    try {
      await fetch(`${API_URL}/history/${currentUser.user_id}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: `content_${Date.now()}`,
          content_type: 'immersion',
          progress: 100,
          duration_seconds: 60
        })
      });
    } catch (err) {
      console.error('Failed to save reading session:', err);
    }
  };

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        跳至主要內容
      </a>

      <AccessibilitySettings onSettingsChange={handleAccessibilityChange} />

      <header className="App-header" role="banner">
        <h1>Project-HOLO</h1>
        <p>多模態敘事沉浸體驗生成器</p>
      </header>

      <main id="main-content" role="main">
        <form onSubmit={handleSubmit} className="narrative-form" aria-label="敘事輸入表單">
          <label htmlFor="narrative-input" className="sr-only">
            輸入您的故事或情境
          </label>
          <textarea
            id="narrative-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t(language, 'placeholder')}
            rows="5"
            disabled={loading}
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : undefined}
          />
        </form>

        <MediaControls
          onScan={handleSubmit}
          onPlay={handleTTS}
          onPause={handlePause}
          onStop={handleStop}
          isPlaying={isPlaying}
          isScanning={isScanning}
          disabled={loading || ttsLoading}
        />

        {error && (
          <div 
            id="error-message"
            className="error-message" 
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {audioSrc && (
          <div className="audio-player" role="region" aria-label="語音播放器">
            <h3>語音輸出</h3>
            <audio 
              controls 
              autoPlay 
              src={audioSrc}
              aria-label="生成的語音音訊"
              onEnded={() => setIsPlaying(false)}
            >
              您的瀏覽器不支援音訊播放。
            </audio>
          </div>
        )}

        {result && (
          <div className="result-container" role="region" aria-label="生成結果">
            <h2>生成結果</h2>
            <div className="result-section">
              <h3>聽覺輸出</h3>
              <pre aria-label="聽覺輸出資料">{JSON.stringify(result.auditory_output, null, 2)}</pre>
            </div>
            <div className="result-section">
              <h3>感官輸出</h3>
              <pre aria-label="感官輸出資料">{JSON.stringify(result.sensory_output, null, 2)}</pre>
            </div>
            <div className="result-section">
              <h3>知識圖譜</h3>
              <pre aria-label="知識圖譜資料">{JSON.stringify(result.knowledge_graph, null, 2)}</pre>
            </div>
          </div>
        )}
      </main>

      {/* Modals/Panels */}
      <UserProfile
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onProfileChange={handleProfileChange}
        language={language}
        userId={currentUser?.user_id}
      />

      <ReadingProgress
        isOpen={progressOpen}
        onClose={() => setProgressOpen(false)}
        language={language}
        userId={currentUser?.user_id}
      />

      <FavoritesList
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        language={language}
        userId={currentUser?.user_id}
      />

      <LoginPage
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        language={language}
      />

      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onRefresh={fetchNotifications}
        language={language}
        userId={currentUser?.user_id}
      />

      <SocialPanel
        isOpen={socialOpen}
        onClose={() => setSocialOpen(false)}
        language={language}
        userId={currentUser?.user_id}
        contentId={result ? `content_${Date.now()}` : null}
      />
    </div>
  );
}

// Main App component with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
