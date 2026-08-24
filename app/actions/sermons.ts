'use server';

import { prisma } from '@/lib/prisma';
import { sermonConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.sermon as unknown as resource.ResourceDelegate;

export async function getAllSermons() {
  return resource.listRows(delegate(), sermonConfig);
}

export async function getPublishedSermons() {
  return resource.listPublishedRows(delegate(), sermonConfig);
}

export async function getSermonById(id: string) {
  return resource.getRowById(delegate(), sermonConfig, id);
}

export async function createSermon(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), sermonConfig, values, publish);
}

export async function updateSermon(id: string, values: FormValues, publish: boolean) {
  return resource.updateRow(delegate(), sermonConfig, id, values, publish);
}

export async function deleteSermon(id: string) {
  return resource.deleteRow(delegate(), sermonConfig, id);
}

export async function toggleSermonPublish(id: string) {
  return resource.toggleRowPublish(delegate(), sermonConfig, id);
}
