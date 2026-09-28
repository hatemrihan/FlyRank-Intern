import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  settingsSchema,
  type SettingsFormData,
  defaultSettings,
} from '../schemas/settingsSchema';

interface SettingsFormProps {
  onSave?: (data: SettingsFormData) => Promise<void> | void;
  initialValues?: Partial<SettingsFormData>;
}

export function SettingsForm({ onSave, initialValues }: SettingsFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...defaultSettings,
      ...initialValues,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SettingsFormData) => {
    setSubmitSuccess(null);
    if (onSave) {
      await onSave(data);
    } else {
      // Mock latency to demonstrate async submit guard
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setSubmitSuccess('Settings saved successfully.');
  };

  return (
    <section
      aria-labelledby="settings-heading"
      style={{
        maxWidth: '520px',
        margin: '2rem auto',
        padding: '2rem',
        borderRadius: '12px',
        background: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 id="settings-heading" style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>
          FlyRank Engine Settings
        </h2>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
          Configure ranking models, accuracy thresholds, and query filters.
        </p>
      </header>

      {/* Accessible live region for success announcements */}
      <div
        role="status"
        aria-live="polite"
        style={{ minHeight: '1.5rem', marginBottom: '1rem' }}
      >
        {submitSuccess && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '6px',
              color: '#065f46',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {submitSuccess}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* API Key */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="apiKey"
            style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}
          >
            FlyRank API Key <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="apiKey"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.apiKey ? 'true' : 'false'}
            aria-describedby={errors.apiKey ? 'apiKey-error' : undefined}
            aria-required="true"
            {...register('apiKey')}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: `1px solid ${errors.apiKey ? '#dc2626' : '#d1d5db'}`,
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          {errors.apiKey && (
            <p id="apiKey-error" role="alert" style={{ margin: '0.375rem 0 0', color: '#dc2626', fontSize: '0.8125rem' }}>
              {errors.apiKey.message}
            </p>
          )}
        </div>

        {/* Model Selection */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="model"
            style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}
          >
            Ranking Model
          </label>
          <select
            id="model"
            aria-invalid={errors.model ? 'true' : 'false'}
            aria-describedby={errors.model ? 'model-error' : undefined}
            {...register('model')}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: `1px solid ${errors.model ? '#dc2626' : '#d1d5db'}`,
              fontSize: '0.875rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="fast">FlyRank Fast (Low Latency)</option>
            <option value="balanced">FlyRank Balanced (Default)</option>
            <option value="pro">FlyRank Pro (High Accuracy)</option>
          </select>
          {errors.model && (
            <p id="model-error" role="alert" style={{ margin: '0.375rem 0 0', color: '#dc2626', fontSize: '0.8125rem' }}>
              {errors.model.message}
            </p>
          )}
        </div>

        {/* Top-K Results */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="topK"
            style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}
          >
            Top-K Results Limit (1 – 100)
          </label>
          <input
            id="topK"
            type="number"
            min={1}
            max={100}
            step={1}
            aria-invalid={errors.topK ? 'true' : 'false'}
            aria-describedby={errors.topK ? 'topK-error' : undefined}
            {...register('topK', { valueAsNumber: true })}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: `1px solid ${errors.topK ? '#dc2626' : '#d1d5db'}`,
              fontSize: '0.875rem',
            }}
          />
          {errors.topK && (
            <p id="topK-error" role="alert" style={{ margin: '0.375rem 0 0', color: '#dc2626', fontSize: '0.8125rem' }}>
              {errors.topK.message}
            </p>
          )}
        </div>

        {/* Min Score Threshold */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="minScore"
            style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}
          >
            Minimum Score Threshold (0.00 – 1.00)
          </label>
          <input
            id="minScore"
            type="number"
            min={0}
            max={1}
            step={0.01}
            aria-invalid={errors.minScore ? 'true' : 'false'}
            aria-describedby={errors.minScore ? 'minScore-error' : undefined}
            {...register('minScore', { valueAsNumber: true })}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: `1px solid ${errors.minScore ? '#dc2626' : '#d1d5db'}`,
              fontSize: '0.875rem',
            }}
          />
          {errors.minScore && (
            <p id="minScore-error" role="alert" style={{ margin: '0.375rem 0 0', color: '#dc2626', fontSize: '0.8125rem' }}>
              {errors.minScore.message}
            </p>
          )}
        </div>

        {/* Domain Filter */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="domainFilter"
            style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}
          >
            Domain Whitelist Filter (optional)
          </label>
          <input
            id="domainFilter"
            type="text"
            placeholder="e.g., docs.flyrank.com"
            aria-invalid={errors.domainFilter ? 'true' : 'false'}
            aria-describedby={errors.domainFilter ? 'domainFilter-error' : undefined}
            {...register('domainFilter')}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: `1px solid ${errors.domainFilter ? '#dc2626' : '#d1d5db'}`,
              fontSize: '0.875rem',
            }}
          />
          {errors.domainFilter && (
            <p id="domainFilter-error" role="alert" style={{ margin: '0.375rem 0 0', color: '#dc2626', fontSize: '0.8125rem' }}>
              {errors.domainFilter.message}
            </p>
          )}
        </div>

        {/* Auto-Rerank Checkbox */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            id="autoRerank"
            type="checkbox"
            {...register('autoRerank')}
            style={{ width: '1rem', height: '1rem', accentColor: '#2563eb', cursor: 'pointer' }}
          />
          <label htmlFor="autoRerank" style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>
            Enable automated real-time re-ranking on query updates
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => reset(defaultSettings)}
            disabled={isSubmitting || !isDirty}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: isDirty ? '#374151' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isDirty && !isSubmitting ? 'pointer' : 'not-allowed',
            }}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              background: isSubmitting ? '#93c5fd' : '#2563eb',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: '0.875rem',
                    height: '0.875rem',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                  }}
                />
                Saving...
              </>
            ) : (
              'Save Engine Settings'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
