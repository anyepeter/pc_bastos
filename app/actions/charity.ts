'use server';

import { prisma } from '@/lib/prisma';
import { charityConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.charityProgram as unknown as resource.ResourceDelegate;

export async function getAllCharityPrograms() {
  return resource.listRows(delegate(), charityConfig);
}

export async function getPublishedCharityPrograms() {
  return resource.listPublishedRows(delegate(), charityConfig);
}

export async function getCharityProgramById(id: string) {
  return resource.getRowById(delegate(), charityConfig, id);
}

export async function getPublishedCharityProgramBySlug(slug: string) {
  return resource.getPublishedRowBySlug(delegate(), charityConfig, slug);
}

export async function createCharityProgram(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), charityConfig, values, publish);
}

export async function updateCharityProgram(
  id: string,
  values: FormValues,
  publish: boolean
) {
  return resource.updateRow(delegate(), charityConfig, id, values, publish);
}

export async function deleteCharityProgram(id: string) {
  return resource.deleteRow(delegate(), charityConfig, id);
}

export async function toggleCharityProgramPublish(id: string) {
  return resource.toggleRowPublish(delegate(), charityConfig, id);
}
