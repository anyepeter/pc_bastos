'use server';

import { prisma } from '@/lib/prisma';
import { eventConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.event as unknown as resource.ResourceDelegate;

export async function getAllEvents() {
  return resource.listRows(delegate(), eventConfig);
}

export async function getPublishedEvents() {
  return resource.listPublishedRows(delegate(), eventConfig);
}

export async function getEventById(id: string) {
  return resource.getRowById(delegate(), eventConfig, id);
}

export async function getPublishedEventBySlug(slug: string) {
  return resource.getPublishedRowBySlug(delegate(), eventConfig, slug);
}

export async function createEvent(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), eventConfig, values, publish);
}

export async function updateEvent(id: string, values: FormValues, publish: boolean) {
  return resource.updateRow(delegate(), eventConfig, id, values, publish);
}

export async function deleteEvent(id: string) {
  return resource.deleteRow(delegate(), eventConfig, id);
}

export async function toggleEventPublish(id: string) {
  return resource.toggleRowPublish(delegate(), eventConfig, id);
}
