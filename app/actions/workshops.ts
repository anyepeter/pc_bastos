'use server';

import { prisma } from '@/lib/prisma';
import { workshopConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.workshop as unknown as resource.ResourceDelegate;

export async function getAllWorkshops() {
  return resource.listRows(delegate(), workshopConfig);
}

export async function getPublishedWorkshops() {
  return resource.listPublishedRows(delegate(), workshopConfig);
}

export async function getWorkshopById(id: string) {
  return resource.getRowById(delegate(), workshopConfig, id);
}

export async function getPublishedWorkshopBySlug(slug: string) {
  return resource.getPublishedRowBySlug(delegate(), workshopConfig, slug);
}

export async function createWorkshop(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), workshopConfig, values, publish);
}

export async function updateWorkshop(id: string, values: FormValues, publish: boolean) {
  return resource.updateRow(delegate(), workshopConfig, id, values, publish);
}

export async function deleteWorkshop(id: string) {
  return resource.deleteRow(delegate(), workshopConfig, id);
}

export async function toggleWorkshopPublish(id: string) {
  return resource.toggleRowPublish(delegate(), workshopConfig, id);
}
