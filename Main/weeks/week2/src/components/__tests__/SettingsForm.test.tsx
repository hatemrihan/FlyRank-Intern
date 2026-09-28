import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsForm } from '../SettingsForm';

describe('SettingsForm (Round 2 Spec-Driven)', () => {
  it('renders all form controls with accessible labels and attributes', () => {
    render(<SettingsForm />);

    expect(screen.getByRole('heading', { name: /FlyRank Engine Settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/FlyRank API Key/i)).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/Ranking Model/i)).toHaveValue('balanced');
    expect(screen.getByLabelText(/Top-K Results Limit/i)).toHaveValue(10);
    expect(screen.getByLabelText(/Minimum Score Threshold/i)).toHaveValue(0.7);
    expect(screen.getByLabelText(/Domain Whitelist Filter/i)).toHaveValue('');
    expect(screen.getByLabelText(/Enable automated real-time re-ranking/i)).toBeChecked();
    expect(screen.getByRole('button', { name: /Save Engine Settings/i })).toBeEnabled();
  });

  it('displays validation errors and sets aria-invalid/aria-describedby on invalid submission', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const submitBtn = screen.getByRole('button', { name: /Save Engine Settings/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const apiKeyInput = screen.getByLabelText(/FlyRank API Key/i);
      expect(apiKeyInput).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText(/API Key is required/i)).toBeInTheDocument();
    });
  });

  it('enforces boundary rules for topK and minScore', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    const topKInput = screen.getByLabelText(/Top-K Results Limit/i);
    const minScoreInput = screen.getByLabelText(/Minimum Score Threshold/i);
    const domainInput = screen.getByLabelText(/Domain Whitelist Filter/i);
    const submitBtn = screen.getByRole('button', { name: /Save Engine Settings/i });

    // Exceed boundaries
    await user.clear(topKInput);
    await user.type(topKInput, '150');

    await user.clear(minScoreInput);
    await user.type(minScoreInput, '1.5');

    await user.type(domainInput, 'invalid-domain-without-tld');

    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Top-K results cannot exceed 100/i)).toBeInTheDocument();
      expect(screen.getByText(/Minimum score threshold cannot exceed 1.0/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid domain format/i)).toBeInTheDocument();
    });
  });

  it('submits successfully with valid data and announces status in live region', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(<SettingsForm onSave={handleSave} />);

    const apiKeyInput = screen.getByLabelText(/FlyRank API Key/i);
    await user.type(apiKeyInput, 'secret_key_12345');

    const submitBtn = screen.getByRole('button', { name: /Save Engine Settings/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith({
        apiKey: 'secret_key_12345',
        model: 'balanced',
        topK: 10,
        minScore: 0.7,
        domainFilter: '',
        autoRerank: true,
      });
      expect(screen.getByText(/Settings saved successfully/i)).toBeInTheDocument();
    });
  });
});
