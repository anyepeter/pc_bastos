'use server';

import { prisma } from '@/lib/prisma';
import { announcementConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.announcement as unknown as resource.ResourceDelegate;

export async function getAllAnnouncements() {
  return resource.listRows(delegate(), announcementConfig);
}

export async function getPublishedAnnouncements() {
  return resource.listPublishedRows(delegate(), announcementConfig);
}

export async function getAnnouncementById(id: string) {
  return resource.getRowById(delegate(), announcementConfig, id);
}

export async function createAnnouncement(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), announcementConfig, values, publish);
}

export async function updateAnnouncement(
  id: string,
  values: FormValues,
  publish: boolean
) {
  return resource.updateRow(delegate(), announcementConfig, id, values, publish);
}

export async function deleteAnnouncement(id: string) {
  return resource.deleteRow(delegate(), announcementConfig, id);
}

export async function toggleAnnouncementPublish(id: string) {
  return resource.toggleRowPublish(delegate(), announcementConfig, id);
}
