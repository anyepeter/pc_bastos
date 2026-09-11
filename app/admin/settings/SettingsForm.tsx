'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  ExternalLink,
  ImageIcon,
  Landmark,
  Languages,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Save,
  Share2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { translateFields } from '@/app/actions/translate';
import type { ActionOutcome } from '@/lib/auth/roles';
import type { Translation } from '@/lib/translations';
import { DEFAULT_LOGO, type MobileMoneyAccount, type SiteSettingsValues } from '@/lib/site-settings';

interface SettingsFormProps {
  initialValues: SiteSettingsValues;
  onSave: (values: SiteSettingsValues) => Promise<ActionOutcome<SiteSettingsValues>>;
}

type TextKey = {
  [K in keyof SiteSettingsValues]: SiteSettingsValues[K] extends string ? K : never;
}[keyof SiteSettingsValues];

type BilingualKey = 'address' | 'officeHours';

const EMPTY_ACCOUNT: MobileMoneyAccount = { provider: '', number: '', accountName: '' };

function Field({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

export default function SettingsForm({ initialValues, onSave }: SettingsFormProps) {
  const [values, setValues] = useState<SiteSettingsValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  const set = <K extends keyof SiteSettingsValues>(key: K, value: SiteSettingsValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const setText = (key: TextKey) => (event: React.ChangeEvent<HTMLInputElement>) =>
    set(key, event.target.value);

  const setBilingual = (key: BilingualKey, language: keyof Translation, text: string) =>
    setValues((current) => ({ ...current, [key]: { ...current[key], [language]: text } }));

  /* List editors: WhatsApp numbers and Mobile Money accounts. */
  const setNumber = (index: number, text: string) =>
    set('whatsapp', values.whatsapp.map((number, i) => (i === index ? text : number)));

  const setAccount = (index: number, key: keyof MobileMoneyAccount, text: string) =>
    set(
      'mobileMoney',
      values.mobileMoney.map((account, i) => (i === index ? { ...account, [key]: text } : account)),
    );

  const fillFrench = async () => {
    setTranslating(true);
    const result = await translateFields({
      texts: { address: values.address.en, officeHours: values.officeHours.en },
      from: 'en',
      to: 'fr',
    }).catch(() => null);
    setTranslating(false);

    if (!result?.success || !result.data) {
      toast.error(result?.error || 'Translation is unavailable right now.');
      return;
    }
    const { address, officeHours } = result.data;
    setValues((current) => ({
      ...current,
      address: { ...current.address, fr: address ?? current.address.fr },
      officeHours: { ...current.officeHours, fr: officeHours ?? current.officeHours.fr },
    }));
    toast.success('French filled in — check it before saving.');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await onSave(values).catch(() => null);
    setSaving(false);

    if (!result?.success) {
      toast.error(result?.error || 'Could not save the settings.');
      return;
    }
    if (result.data) setValues(result.data);
    toast.success('Settings saved. The public site is updated.');
  };

  const bilingualInputs = (key: BilingualKey, rows: number, required = false) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {(['en', 'fr'] as const).map((language) => (
        <div key={language} className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {language === 'en' ? 'English' : 'Français'}
            {required && language === 'en' && <span className="ml-0.5 text-red-600">*</span>}
          </p>
          <Textarea
            id={`${key}-${language}`}
            rows={rows}
            value={values[key][language]}
            required={required && language === 'en'}
            onChange={(event) => setBilingual(key, language, event.target.value)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4 text-gray-500" /> Logo
          </CardTitle>
          <CardDescription>
            Shown in the header, the footer, the sign-in page and the browser tab. A square
            PNG with a transparent background works best. Remove it to go back to the
            original CEPCA logo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={values.logo || DEFAULT_LOGO}
              alt="Current logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <ImageUpload
              value={values.logo || undefined}
              onChange={(url) => set('logo', url)}
              onRemove={() => set('logo', '')}
              disabled={saving}
              folder="settings"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Contact ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="h-4 w-4 text-gray-500" /> Contact
          </CardTitle>
          <CardDescription>Shown in the footer and on the contact and give pages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="email"
              label="Email"
              required
              hint="Messages sent through the contact form are delivered here."
            >
              <Input id="email" type="email" required value={values.email} onChange={setText('email')} />
            </Field>
            <Field id="phone" label="Office phone" required hint="Include the country code.">
              <Input id="phone" type="tel" required value={values.phone} onChange={setText('phone')} />
            </Field>
          </div>

          <Field
            id="whatsapp-0"
            label="WhatsApp numbers"
            hint="Listed on the contact page. The first one also powers the floating WhatsApp button — remove them all to hide it."
          >
            <div className="space-y-2">
              {values.whatsapp.map((number, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    id={`whatsapp-${index}`}
                    type="tel"
                    value={number}
                    placeholder="+237 677 875 300"
                    onChange={(event) => setNumber(index, event.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={`Remove ${number || 'this number'}`}
                    onClick={() => set('whatsapp', values.whatsapp.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {values.whatsapp.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set('whatsapp', [...values.whatsapp, ''])}
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Add a number
                </Button>
              )}
            </div>
          </Field>
        </CardContent>
      </Card>

      {/* ── Address & hours ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-gray-500" /> Address &amp; opening hours
            </CardTitle>
            <CardDescription>
              The map on the contact page is drawn from the English address.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillFrench}
            disabled={translating || !values.address.en.trim()}
          >
            {translating ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Languages className="mr-1.5 h-4 w-4" />
            )}
            Fill French from English
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field id="address-en" label="Address" required>
            {bilingualInputs('address', 2, true)}
          </Field>
          <Field id="officeHours-en" label="Opening hours" hint="One line per entry. Leave blank to hide.">
            {bilingualInputs('officeHours', 3)}
          </Field>
          <Field
            id="mapsUrl"
            label="Google Maps link"
            hint={'In Google Maps, open the council’s pin, choose Share and paste the link here. Used for "Get directions".'}
          >
            <Input
              id="mapsUrl"
              type="url"
              value={values.mapsUrl}
              placeholder="https://maps.app.goo.gl/…"
              onChange={setText('mapsUrl')}
            />
          </Field>
        </CardContent>
      </Card>

      {/* ── Social media ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-4 w-4 text-gray-500" /> Social media
          </CardTitle>
          <CardDescription>
            Full links to the council&apos;s pages. Only the ones filled in appear in the footer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {(
            [
              ['facebookUrl', 'Facebook', 'https://facebook.com/…'],
              ['instagramUrl', 'Instagram', 'https://instagram.com/…'],
              ['xUrl', 'X (Twitter)', 'https://x.com/…'],
              ['youtubeUrl', 'YouTube', 'https://youtube.com/@…'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <Field key={key} id={key} label={label}>
              <Input id={key} type="url" value={values[key]} placeholder={placeholder} onChange={setText(key)} />
            </Field>
          ))}
        </CardContent>
      </Card>

      {/* ── Giving ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Landmark className="h-4 w-4 text-gray-500" /> Giving accounts
          </CardTitle>
          <CardDescription>
            Shown on the give page, where visitors copy them to send money. Check every digit.
            While everything here is blank, the page offers the office&apos;s phone and email
            instead.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-900">Bank transfer</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="bankName" label="Bank">
                <Input id="bankName" value={values.bankName} onChange={setText('bankName')} />
              </Field>
              <Field id="bankAccountName" label="Account name">
                <Input id="bankAccountName" value={values.bankAccountName} onChange={setText('bankAccountName')} />
              </Field>
              <Field id="bankAccountNumber" label="Account number">
                <Input
                  id="bankAccountNumber"
                  value={values.bankAccountNumber}
                  onChange={setText('bankAccountNumber')}
                />
              </Field>
              <Field id="bankSwift" label="SWIFT / BIC" hint="Optional, for transfers from abroad.">
                <Input id="bankSwift" value={values.bankSwift} onChange={setText('bankSwift')} />
              </Field>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-900">Mobile Money</p>
            {values.mobileMoney.map((account, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
              >
                <Field id={`momo-provider-${index}`} label="Provider">
                  <Input
                    id={`momo-provider-${index}`}
                    value={account.provider}
                    placeholder="MTN Mobile Money"
                    onChange={(event) => setAccount(index, 'provider', event.target.value)}
                  />
                </Field>
                <Field id={`momo-number-${index}`} label="Number">
                  <Input
                    id={`momo-number-${index}`}
                    type="tel"
                    value={account.number}
                    onChange={(event) => setAccount(index, 'number', event.target.value)}
                  />
                </Field>
                <Field id={`momo-name-${index}`} label="Account name">
                  <Input
                    id={`momo-name-${index}`}
                    value={account.accountName}
                    onChange={(event) => setAccount(index, 'accountName', event.target.value)}
                  />
                </Field>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Remove this account"
                  onClick={() => set('mobileMoney', values.mobileMoney.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {values.mobileMoney.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set('mobileMoney', [...values.mobileMoney, { ...EMPTY_ACCOUNT }])}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add a Mobile Money account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Save bar ────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-4 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Link
          href="/contact"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View contact page <ExternalLink className="h-4 w-4" />
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save settings
        </Button>
      </div>
    </form>
  );
}
