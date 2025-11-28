# i18next Setup Guide for CEPCA Church Application

## ✅ Completed Setup

### 1. Installed Packages
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Created Translation Files

**Location:** `public/locales/`

- ✅ `public/locales/en/translation.json` - English translations
- ✅ `public/locales/fr/translation.json` - French translations

### 3. Created Configuration Files

**Location:** `lib/i18n.ts`

This file configures i18next with:
- Language detection (localStorage → browser preferences)
- Fallback to English
- localStorage persistence
- Next.js compatibility

### 4. Updated Redux Integration

**Location:** `store/blogSlice.ts`

- Updated `setLanguage` action to sync with i18next
- Language changes now update both Redux AND i18next simultaneously

### 5. Created I18nProvider

**Location:** `components/I18nProvider.tsx`

- Initializes i18next on app load
- Syncs Redux and i18next language state
- Detects browser language on first visit

---

## 🚀 How to Use Translations in Your Components

### Method 1: Using `useTranslation` Hook (Client Components)

```tsx
'use client';

import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      <button>{t('common.donate')}</button>
    </div>
  );
}
```

### Method 2: With Redux Language State (Already in use for blogs)

```tsx
'use client';

import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { useTranslation } from 'react-i18next';

export default function BlogComponent() {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const currentPost = useAppSelector((state) => state.blog.currentPost);

  // For static text from translation files
  const staticText = t('blogList.pageTitle');

  // For dynamic content from database (blog posts)
  const translatedTitle = getTranslatedText(currentPost.title, language);

  return (
    <div>
      <h1>{staticText}</h1>
      <h2>{translatedTitle}</h2>
    </div>
  );
}
```

---

## 📝 Integration Steps for Existing Components

### Step 1: Wrap App with I18nProvider

**File:** `app/layout.tsx`

```tsx
import StoreProvider from '@/components/StoreProvider';
import I18nProvider from '@/components/I18nProvider';
import '@/lib/i18n'; // Initialize i18next

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
```

### Step 2: Update Individual Components

#### Example: Hero Section

**Before:**
```tsx
<h1>BEING CHURCH TOGETHER</h1>
<p>Jesus is holy, loving...</p>
<button>Contact Us</button>
```

**After:**
```tsx
'use client';

import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
      <button>{t('hero.contactUs')}</button>
    </>
  );
}
```

#### Example: Welcome Section

**Before:**
```tsx
<div className="text-purple-600 font-semibold">
  Welcome to CEPCA
</div>
<h2>Being Church <span>Together</span></h2>
```

**After:**
```tsx
'use client';

import { useTranslation } from 'react-i18next';

export default function WelcomeSection() {
  const { t } = useTranslation();

  return (
    <>
      <div className="text-purple-600 font-semibold">
        {t('welcome.tagline')}
      </div>
      <h2>
        {t('welcome.title')}
        <span className="text-purple-600"> {t('welcome.titleHighlight')}</span>
      </h2>
      <p>{t('welcome.description')}</p>
    </>
  );
}
```

#### Example: Footer

**Before:**
```tsx
<h3>CEPCA</h3>
<p>Council of Protestant Churches</p>
<p>Building faith communities...</p>
```

**After:**
```tsx
'use client';

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <h3>{t('common.cepca')}</h3>
      <p>{t('footer.tagline')}</p>
      <p>{t('footer.description')}</p>
      <p>{t('footer.servingSince')}</p>
    </>
  );
}
```

#### Example: Contact Page

**Before:**
```tsx
<h1>Get in <span>Touch</span></h1>
<h2>We're Here for You</h2>
<label>Full Name *</label>
<button>Send Message</button>
```

**After:**
```tsx
'use client';

import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>
        {t('contact.pageTitle')} <span>{t('contact.pageTitleHighlight')}</span>
      </h1>
      <h2>{t('contact.weAreHere')}</h2>
      <label>{t('contact.form.fullName')} {t('contact.form.required')}</label>
      <button>{t('common.sendMessage')}</button>
    </>
  );
}
```

---

## 🎯 Language Switching

### The Language Selector is Already Integrated!

**File:** `components/LanguageSelector.tsx`

The existing `LanguageSelector` component already works perfectly because:
1. It updates Redux state via `setLanguage` action
2. The updated Redux action now also changes i18next language
3. All components using `useTranslation()` will automatically re-render

**Usage:**
```tsx
import LanguageSelector from '@/components/LanguageSelector';

// Place it in your navbar or anywhere you want
<LanguageSelector />
```

---

## 📁 Translation File Structure

### Accessing Nested Keys

```json
{
  "welcome": {
    "healthcare": {
      "title": "Healthcare",
      "description": "350 hospitals..."
    }
  }
}
```

**Access in component:**
```tsx
{t('welcome.healthcare.title')}
{t('welcome.healthcare.description')}
```

---

## 🔄 Adding New Translations

### 1. Add to English file (`public/locales/en/translation.json`):
```json
{
  "myNewSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

### 2. Add to French file (`public/locales/fr/translation.json`):
```json
{
  "myNewSection": {
    "title": "Nouveau Titre",
    "description": "Nouvelle Description"
  }
}
```

### 3. Use in component:
```tsx
{t('myNewSection.title')}
{t('myNewSection.description')}
```

---

## ⚠️ Important Notes

### 1. Client Components Only
- `useTranslation()` only works in **'use client'** components
- Add `'use client';` at the top of any component using translations

### 2. Server Components Alternative
For server components that need translations, you can:
- Pass translated text as props from a client component
- Or keep static text and handle translation in the parent

### 3. Dynamic Content from Database
- Use the existing `getTranslatedText()` helper for blog posts and other DB content
- Use `useTranslation()` for static UI text from translation files

### 4. Language Persistence
- Language choice is automatically saved to localStorage
- On next visit, the app will remember the user's preference

---

## 🧪 Testing

### Test Language Switching:
1. Open the app
2. Click the language selector (EN/FR buttons)
3. All static text should immediately change
4. Reload the page - language should persist

### Test Browser Detection:
1. Clear localStorage: `localStorage.clear()`
2. Reload the page
3. App should detect browser language (French if browser is set to French)

---

## 📋 Components to Update

Based on your codebase, here are the main components to update:

### High Priority (Main Pages):
- ✅ Navigation.tsx → Example created (`NavigationWithI18n.tsx`)
- [ ] HeroSection.tsx
- [ ] WelcomeSection.tsx
- [ ] MissionVisionSection.tsx
- [ ] ObjectivesSection.tsx
- [ ] Footer.tsx
- [ ] Contact page (`app/contact/page.tsx`)
- [ ] About page (`app/about/page.tsx`)
- [ ] Sermons page (`app/sermons/page.tsx`)

### Medium Priority:
- [ ] CharitySection.tsx
- [ ] SermonsSection.tsx
- [ ] AboutCEPCASection.tsx
- [ ] Events page
- [ ] Workshops page

### Already Handled:
- ✅ Blog pages (already using Translation type + Redux)
- ✅ LanguageSelector (already integrated)

---

## 🎉 Benefits of This Setup

1. **Dual System**: Works with both static UI text (i18next) AND dynamic DB content (Translation type)
2. **Persistent**: User language choice saved in localStorage
3. **Auto-Detection**: Detects browser language on first visit
4. **Redux Integration**: Single source of truth for language state
5. **Easy to Maintain**: All translations in organized JSON files
6. **Type-Safe**: TypeScript support with proper typing

---

## 🆘 Troubleshooting

### Translation not showing:
- Check if component has `'use client'` directive
- Verify translation key exists in both en.json and fr.json
- Check browser console for i18next errors

### Language not persisting:
- Check if localStorage is enabled
- Verify Redux setLanguage action is being called
- Check browser dev tools → Application → Local Storage

### Language not switching:
- Ensure component is using `useTranslation()` hook
- Check if i18next is properly initialized in app layout
- Verify I18nProvider is wrapping your app

---

## 📞 Next Steps

1. **Update app/layout.tsx** to include I18nProvider
2. **Start updating components** one by one (use NavigationWithI18n.tsx as reference)
3. **Test thoroughly** after each component update
4. **Add missing translations** as you discover them
5. **Consider creating translation admin panel** for non-technical staff

---

## 📚 Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Next.js i18n Guide](https://nextjs.org/docs/advanced-features/i18n-routing)

---

**Created by Claude Code for CEPCA Church Application**
**Last Updated:** 2025-11-28
