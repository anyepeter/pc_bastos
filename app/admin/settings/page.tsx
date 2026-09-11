import { requireSuperAdminPage } from '@/lib/auth/roles';
import { getSiteSettings, updateSiteSettings } from '@/app/actions/settings';
import SettingsForm from './SettingsForm';

/**
 * The council's own details. Every public page reads them, so this screen is
 * for the secretariat only; the save action re-checks the role independently.
 */
export default async function SiteSettingsPage() {
  await requireSuperAdminPage();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Site settings</h1>
        <p className="mt-2 text-gray-600">
          The council&apos;s logo, contact details, social links and giving accounts —
          exactly as the public site shows them.
        </p>
      </div>

      <SettingsForm initialValues={settings} onSave={updateSiteSettings} />
    </div>
  );
}
