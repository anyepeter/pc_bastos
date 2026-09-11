'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ImportDepartmentsButtonProps {
  onImport: () => Promise<{
    success: boolean;
    error?: string;
    data?: { departments: number; activities: number; skipped: number };
  }>;
  /** How many of the council's departments are still missing, for the label. */
  missing: number;
}

/**
 * Adds the council's eight departments — written up from the secretariat's
 * documents in lib/departments-seed.ts — with their draft activities. Only
 * the missing ones are inserted; nothing existing is touched.
 */
export function ImportDepartmentsButton({ onImport, missing }: ImportDepartmentsButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const run = async () => {
    setOpen(false);
    setIsImporting(true);

    const result = await onImport();

    if (result.success && result.data) {
      const { departments, activities } = result.data;
      toast.success(
        departments === 0
          ? 'All of the council’s departments are already here — nothing was changed'
          : `Added ${departments} department${departments === 1 ? '' : 's'} and ${activities} draft activit${activities === 1 ? 'y' : 'ies'}`
      );
      router.refresh();
    } else {
      toast.error(result.error || 'Could not import the departments');
    }

    setIsImporting(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} disabled={isImporting}>
        {isImporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Import the council&apos;s departments
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import the council&apos;s departments?</AlertDialogTitle>
            <AlertDialogDescription>
              {missing > 0
                ? `This adds the ${missing} department${missing === 1 ? '' : 's'} not yet here, in English and French, from the documents the secretariat supplied — with their planned activities as unpublished drafts. `
                : 'All eight are already here, so nothing will be added. '}
              Departments that already exist are left exactly as they are.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={run}>Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
