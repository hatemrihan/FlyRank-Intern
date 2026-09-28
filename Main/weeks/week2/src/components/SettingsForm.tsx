import React, { useState } from 'react';

export function SettingsForm() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('flyrank-v1');
  const [topK, setTopK] = useState(10);
  const [minScore, setMinScore] = useState(0.7);
  const [domainFilter, setDomainFilter] = useState('');
  const [autoRerank, setAutoRerank] = useState(true);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!apiKey) {
      errs.apiKey = 'API Key is required';
    } else if (apiKey.length < 8) {
      errs.apiKey = 'API Key must be at least 8 characters';
    }

    // AI mistake: naive topK validation without integer check or upper bound enforcement
    if (topK <= 0) {
      errs.topK = 'Top K results must be greater than 0';
    }

    // AI mistake: minScore validation without lower bound or type checking
    if (minScore > 1) {
      errs.minScore = 'Score cannot exceed 1.0';
    }

    // Naive regex for domain
    if (domainFilter && !domainFilter.includes('.')) {
      errs.domainFilter = 'Invalid domain filter format';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (validate()) {
      // Simulate save
      setSuccess(true);
      console.log('Settings saved:', { apiKey, model, topK, minScore, domainFilter, autoRerank });
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>FlyRank Settings</h2>
      {success && <div style={{ color: 'green', marginBottom: '15px' }}>Settings saved successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <div>API Key:</div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.apiKey && <div style={{ color: 'red', fontSize: '12px' }}>{errors.apiKey}</div>}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div>Ranking Model:</div>
          <select value={model} onChange={(e) => setModel(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="flyrank-v1">FlyRank Standard v1</option>
            <option value="flyrank-fast">FlyRank Flash v2</option>
            <option value="flyrank-pro">FlyRank Pro v2</option>
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div>Top-K Results Limit:</div>
          <input
            type="number"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.topK && <div style={{ color: 'red', fontSize: '12px' }}>{errors.topK}</div>}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div>Minimum Score Threshold (0.0 - 1.0):</div>
          <input
            type="number"
            step="0.05"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.minScore && <div style={{ color: 'red', fontSize: '12px' }}>{errors.minScore}</div>}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div>Domain Filter (optional):</div>
          <input
            type="text"
            placeholder="e.g. flyrank.io"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
          {errors.domainFilter && <div style={{ color: 'red', fontSize: '12px' }}>{errors.domainFilter}</div>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>
            <input
              type="checkbox"
              checked={autoRerank}
              onChange={(e) => setAutoRerank(e.target.checked)}
            />
            {' '}Auto-rerank on query update
          </label>
        </div>

        <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save Settings
        </button>
      </form>
    </div>
  );
}
