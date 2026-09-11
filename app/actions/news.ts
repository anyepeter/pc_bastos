'use server';

import { prisma } from '@/lib/prisma';
import { newsConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.newsArticle as unknown as resource.ResourceDelegate;

export async function getAllNews() {
  return resource.listRows(delegate(), newsConfig);
}

export async function getPublishedNews() {
  return resource.listPublishedRows(delegate(), newsConfig);
}

export async function getNewsById(id: string) {
  return resource.getRowById(delegate(), newsConfig, id);
}

export async function getPublishedNewsBySlug(slug: string) {
  return resource.getPublishedRowBySlug(delegate(), newsConfig, slug);
}

export async function createNews(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), newsConfig, values, publish);
}

export async function updateNews(
  id: string,
  values: FormValues,
  publish: boolean
) {
  return resource.updateRow(delegate(), newsConfig, id, values, publish);
}

export async function deleteNews(id: string) {
  return resource.deleteRow(delegate(), newsConfig, id);
}

export async function toggleNewsPublish(id: string) {
  return resource.toggleRowPublish(delegate(), newsConfig, id);
}
