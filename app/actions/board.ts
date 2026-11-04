'use server';

import { prisma } from '@/lib/prisma';
import { boardMemberConfig } from '@/lib/admin/configs';
import { FormValues } from '@/lib/admin/resource-config';
import * as resource from '@/lib/admin/resource-actions';

const delegate = () => prisma.boardMember as unknown as resource.ResourceDelegate;

export async function getAllBoardMembers() {
  return resource.listRows(delegate(), boardMemberConfig);
}

/** Published members in chart order; an empty list when the table is unreachable. */
export async function getPublishedBoardMembers() {
  return resource.listPublishedRows(delegate(), boardMemberConfig);
}

export async function getBoardMemberById(id: string) {
  return resource.getRowById(delegate(), boardMemberConfig, id);
}

export async function createBoardMember(values: FormValues, publish: boolean) {
  return resource.createRow(delegate(), boardMemberConfig, values, publish);
}

export async function updateBoardMember(id: string, values: FormValues, publish: boolean) {
  return resource.updateRow(delegate(), boardMemberConfig, id, values, publish);
}

export async function deleteBoardMember(id: string) {
  return resource.deleteRow(delegate(), boardMemberConfig, id);
}

export async function toggleBoardMemberPublish(id: string) {
  return resource.toggleRowPublish(delegate(), boardMemberConfig, id);
}
